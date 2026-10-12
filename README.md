# ProjectMatch

**ProjectMatch** is an AI-powered student project team formation and collaboration platform. Students can register, build detailed profiles, showcase technical skills and availability, discover projects, apply to teams, receive matching recommendations, collaborate on Kanban tasks, and leverage an AI project assistant.

---

## Tech Stack

- **Frontend:** React 19, Vite, React Router 7, Axios, Bootstrap 5, Lucide React, Nginx.
- **Backend:** Java 17, Spring Boot 3.3.4, Spring Security, JWT, Spring Data JPA, Flyway 10, Maven.
- **Database:** MySQL 8.0 (production & Docker) / H2 in MySQL compatibility mode (automated tests).
- **AI Integration:** Google Gemini 1.5 Flash API with built-in deterministic offline fallback.
- **Containerization:** Docker multi-stage builds & Docker Compose.

---

## Quick Start with Docker Compose (Recommended)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) (v24.0+) & Docker Compose (v2.20+)

### 1. Configure Environment

Copy the root environment template:

```bash
cp .env.example .env
```

Review `.env` and set secure passwords and secrets for production:
- `DB_PASSWORD`: Password for MySQL `projectmatch` user.
- `DB_ROOT_PASSWORD`: Root password for MySQL.
- `JWT_SECRET`: Random string with at least 32 characters (256-bit).
- `AI_API_KEY`: *(Optional)* Your Google Gemini API key.

### 2. Build and Launch All Services

```bash
docker compose up --build -d
```

This starts:
1. `projectmatch-mysql`: MySQL 8.0 database with persistent storage (`mysql_data` volume).
2. `projectmatch-backend`: Spring Boot API on port `8080` (runs Flyway V1 schema migration automatically).
3. `projectmatch-frontend`: React 19 application served by Nginx on port `3000` (with SPA fallback routing and `/api` reverse proxy).

### 3. Access URLs

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend REST API:** [http://localhost:8080](http://localhost:8080)
- **Health Check Endpoint:** [http://localhost:8080/api/health](http://localhost:8080/api/health)
- **Swagger / OpenAPI Documentation:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

Default administrator credentials (seeded automatically on first startup):
- **Email:** `admin@projectmatch.edu`
- **Password:** `admin123`

---

## Docker Operations & Management

### View Container Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql
```

### Check Service Health & Status

```bash
docker compose ps
```

### Stop Services (Preserving Database Data)

```bash
docker compose down
```

> **Note:** Stopping containers with `docker compose down` preserves your MySQL data inside the named volume `mysql_data`.

### Stop Services and Reset Database (Destructive)

```bash
docker compose down -v
```

> ⚠️ **Warning:** The `-v` flag removes persistent volumes, deleting all database records.

### Database Backup & Restore

**Backup MySQL Database:**
```bash
docker compose exec mysql mysqldump -u projectmatch -p projectmatch > projectmatch_backup.sql
```

**Restore MySQL Database:**
```bash
docker compose exec -T mysql mysql -u projectmatch -p projectmatch < projectmatch_backup.sql
```

---

## Local Development (Without Docker)

### Prerequisites

- Java 17+ (JDK 17 or JDK 21)
- Maven 3.9+
- Node.js 20+ & npm

### Backend

```bash
cd backend

# Run automated tests (14 tests using H2 & Flyway)
mvn test

# Package executable fat JAR
mvn clean package

# Run backend locally
mvn spring-boot:run
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run automated unit/integration tests (37 tests using Vitest)
npm test

# Build production bundle
npm run build

# Start local dev server
npm run dev
```

Local dev URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

---

## Verification Status

| Component | Automated Check | Status |
|-----------|-----------------|--------|
| Backend Tests | `mvn test` | ✅ 15 / 15 passing (Integration, Flyway, Profile, Team) |
| Backend Package | `mvn clean package` | ✅ BUILD SUCCESS (Executable JAR ~57 MB) |
| Frontend Tests | `npm test` | ✅ 37 / 37 passing (Vitest, RTL, jsdom) |
| Frontend Build | `npm run build` | ✅ Built cleanly in ~480ms |
| Database Migration | Flyway V1 DDL + `ddl-auto=validate` | ✅ Verified against schema |
| Docker Build / Run | `docker compose up` | ⚠️ Dockerfiles and compose configs complete; runtime execution unverified in host environment without Docker daemon. |
