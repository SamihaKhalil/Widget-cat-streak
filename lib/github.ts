interface ContributionDay {
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface GitHubGraphQLResponse {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: { weeks: ContributionWeek[] };
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
}

export async function getGitHubStats(username: string) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured");
  }

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "github-readme-widget",
    },
    body: JSON.stringify({ query, variables: { login: username } }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status}`);
  }

  const json = (await response.json()) as GitHubGraphQLResponse;

  if (json.errors?.length) {
    throw new Error(json.errors.map(({ message }) => message).join("; "));
  }

  const user = json.data?.user;

  if (!user) {
    throw new Error(`GitHub user ${username} was not found`);
  }

  const weeks = user.contributionsCollection.contributionCalendar.weeks;
  const days = weeks.flatMap((week) => week.contributionDays);

  return { currentStreak: calculateCurrentStreak(days) };
}

function calculateCurrentStreak(days: ContributionDay[]) {
  let streak = 0;
  const reversed = [...days].reverse();
  let startIndex = 0;

  // Today can still be empty without ending yesterday's active streak.
  if (reversed[0]?.contributionCount === 0) {
    startIndex = 1;
  }

  for (let index = startIndex; index < reversed.length; index++) {
    if (reversed[index].contributionCount === 0) {
      break;
    }
    streak++;
  }

  return streak;
}
