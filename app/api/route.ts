import { ASSETS } from "@/lib/assets";
import { getGitHubStats } from "@/lib/github";
import { getPetState } from "@/lib/pet";
import { connection } from "next/server";

const USERNAME = "SamihaKhalil";

export async function GET() {
  await connection();

  try {
    const stats = await getGitHubStats(USERNAME);
    const pet = getPetState(stats.currentStreak);
    return svgResponse(renderWidget(stats.currentStreak, pet.asset));
  } catch (error) {
    console.error("Unable to generate GitHub widget", error);
    return svgResponse(renderErrorWidget(), "public, s-maxage=60");
  }
}

function renderWidget(currentStreak: number, petAsset: string) {
  return `
    <svg width="330" height="330" viewBox="0 0 330 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title description">
      <title id="title">GitHub contribution streak for ${USERNAME}</title>
      <desc id="description">Current streak: ${currentStreak} days</desc>
      <rect width="100%" height="100%" rx="16" fill="#050505" />
      <image href="${petAsset}" x="30" y="90" width="250" height="250" />
      <image href="${ASSETS.fish}" x="33" y="20" width="250" height="110" />
      <text x="70" y="70" fill="white" font-size="16" font-weight="bold" font-family="Arial, sans-serif">Contribution Streak</text>
      <text x="90" y="105" fill="white" font-family="Arial, sans-serif">
        <tspan font-size="32" font-weight="bold">${currentStreak}</tspan>
        <tspan font-size="16" font-weight="bold"> Days</tspan>
      </text>
    </svg>
  `.trim();
}

function renderErrorWidget() {
  return `
    <svg width="330" height="120" viewBox="0 0 330 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="error-title">
      <title id="error-title">GitHub widget temporarily unavailable</title>
      <rect width="100%" height="100%" rx="16" fill="#050505" />
      <text x="165" y="56" fill="white" text-anchor="middle" font-size="16" font-weight="bold" font-family="Arial, sans-serif">Widget unavailable</text>
      <text x="165" y="82" fill="#a1a1aa" text-anchor="middle" font-size="13" font-family="Arial, sans-serif">Please try again later</text>
    </svg>
  `.trim();
}

function svgResponse(
  svg: string,
  cacheControl = "public, s-maxage=3600, stale-while-revalidate=86400",
) {
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": cacheControl,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
