# ProjectMatch Deployment

## Frontend: Vercel

1. Import the `frontend` directory as the Vercel project root.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Add `VITE_API_URL` with the deployed backend URL, for example `https://projectmatch-api.onrender.com`.
5. Keep `frontend/vercel.json`; it rewrites nested React Router routes to `index.html`.

## Backend: Render

1. Create a Render Web Service from the repository with `backend` as the root directory.
2. Use Java 17.
3. Build command: `mvn package`.
4. Start command: `java -jar target/projectmatch-backend-0.0.1-SNAPSHOT.jar`.
5. Configure environment variables:
   - `SERVER_PORT`: Render normally provides `PORT`; if needed map it to `SERVER_PORT`.
   - `SPRING_DATASOURCE_URL`: production MySQL JDBC URL.
   - `SPRING_DATASOURCE_USERNAME`: production MySQL user.
   - `SPRING_DATASOURCE_PASSWORD`: production MySQL password.
   - `JWT_SECRET`: strong random secret, at least 32 characters.
   - `JWT_EXPIRATION_MS`: token lifetime, for example `86400000`.
   - `CORS_ALLOWED_ORIGINS`: deployed Vercel frontend origin.

## Database

Use an external production MySQL provider. Render does not provide managed MySQL by default. Create a `projectmatch` database, then point `SPRING_DATASOURCE_URL` to it. The backend currently uses Hibernate `ddl-auto=update`, so review schema changes before pointing at existing production data.

## Verification

After deployment:

1. Open `/api/health` on the backend.
2. Open `/swagger-ui/index.html` on the backend.
3. Register a new student from the frontend.
4. Log in, update the profile, add and remove a skill, create or browse projects, apply to a project, and refresh nested routes.
