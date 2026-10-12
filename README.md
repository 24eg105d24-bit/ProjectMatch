# ProjectMatch

ProjectMatch is a full-stack student collaboration and project matching platform. Students can register, maintain a profile, manage skills and interests, discover projects, apply to teams, receive deterministic recommendations, and collaborate on team tasks.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Bootstrap, lucide-react.
- Backend: Java 17, Spring Boot 3.3.4, Spring Security, JWT, Spring Data JPA, Maven.
- Database: MySQL for local and production, H2 for automated backend tests.
- API docs: Swagger/OpenAPI at `http://localhost:8080/swagger-ui/index.html`.

## Folder Structure

- `frontend`: React/Vite application.
- `backend`: Spring Boot REST API.
- `DEPLOYMENT.md`: Vercel, Render, and MySQL deployment notes.

## Prerequisites

- Java 17.
- Maven.
- Node.js and npm.
- MySQL with a database named `projectmatch`.

## Backend Setup

From `backend`, configure environment variables from `backend/.env.example`:

- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `CORS_ALLOWED_ORIGINS`
- `SERVER_PORT`

Start the backend:

```bash
cd backend
mvn spring-boot:run
```

Run tests and package:

```bash
cd backend
mvn test
mvn package
```

## Frontend Setup

From `frontend`, configure `VITE_API_URL` using `frontend/.env.example`.

```bash
cd frontend
npm install
npm run dev
```

Build and lint:

```bash
cd frontend
npm run lint
npm run build
```

## Local URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger-ui/index.html`

## Features

- JWT registration and login.
- Protected student profile endpoints.
- Persistent profile, interests, and skill associations.
- Public project discovery and project details.
- Authenticated project creation, applications, teams, invitations, tasks, and recommendations APIs.
- Frontend project data integration with backend APIs while preserving the existing UI.

## Known Limitations

- Full browser end-to-end verification against a live MySQL instance was not completed in this pass because local MySQL credentials and running services are environment-specific.
- Backend tests currently focus on the confirmed skill deletion workflow. Broader controller and workflow test coverage should be expanded before production launch.
