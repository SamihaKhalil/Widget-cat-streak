# GitHub README Widget

Widget SVG para mostrar la racha actual de contribuciones de
[`SamihaKhalil`](https://github.com/SamihaKhalil) con una mascota que cambia de
estado según la racha.

## Desarrollo local

Requisitos: Node.js 20 o posterior y un token personal de GitHub con acceso de
lectura a la información pública del perfil.

1. Ejecuta `npm install`.
2. Crea un archivo `.env.local` que no se debe subir al repositorio:

   ```env
   GITHUB_TOKEN=tu_token_de_github
   ```

3. Ejecuta `npm run dev`.
4. Abre `http://localhost:3000/api` para ver el SVG.

## Despliegue en Vercel

1. Sube este proyecto a un repositorio de GitHub.
2. Importa el repositorio en Vercel.
3. En **Settings > Environment Variables**, agrega `GITHUB_TOKEN` para
   Production, Preview y Development.
4. Despliega y comprueba `https://tu-proyecto.vercel.app/api`.

No agregues el token al código ni al README. Los archivos `.env*` están
ignorados por Git.

## Agregarlo al perfil de GitHub

En el repositorio de perfil `SamihaKhalil/SamihaKhalil`, agrega al `README.md`:

```md
![GitHub contribution streak](https://tu-proyecto.vercel.app/api)
```

Sustituye `tu-proyecto` por el dominio asignado por Vercel.
