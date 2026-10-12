# ProjectMatch Deployment Guide

This guide details deployment options for **ProjectMatch: AI-Powered Student Project Team Formation & Collaboration Platform**.

---

## Option 1: Docker Compose (Self-Hosted / Cloud VM)

The fastest and most reproducible way to run ProjectMatch in production is using Docker Compose.

### Steps

1. Clone repository to your target server (e.g. Ubuntu 22.04 VM, AWS EC2, DigitalOcean Droplet).
2. Install Docker and Docker Compose plugin:
   ```bash
   sudo apt update && sudo apt install -y docker.io docker-compose-v2
   ```
3. Copy and configure the environment variables:
   ```bash
   cp .env.example .env
   nano .env
   ```
   Configure secure values for `DB_PASSWORD`, `DB_ROOT_PASSWORD`, and `JWT_SECRET`.
4. Launch the stack in detached mode:
   ```bash
   docker compose up --build -d
   ```
5. Verify services are healthy:
   ```bash
   docker compose ps
   ```

### Ports & Endpoints
- **Frontend (Nginx / SPA):** `http://<server-ip>:3000` (or configure a reverse proxy to port 80/443 with SSL).
- **Backend API:** `http://<server-ip>:8080/api/health`
- **Swagger Documentation:** `http://<server-ip>:8080/swagger-ui/index.html`

---

## Option 2: Cloud PaaS (Vercel Frontend + Render Backend)

### Frontend: Vercel

1. Import the `frontend` directory as the Vercel project root.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Environment variables:
   - `VITE_API_URL`: Deployed backend URL (e.g., `https://projectmatch-api.onrender.com`).
5. Ensure `frontend/vercel.json` is preserved to rewrite nested React Router routes to `index.html`.

### Backend: Render

1. Create a Render Web Service with `backend` as the root directory.
2. Runtime: **Java 17**.
3. Build command: `mvn clean package -DskipTests`.
4. Start command: `java -jar target/projectmatch-backend-0.0.1-SNAPSHOT.jar`.
5. Environment variables:
   - `SERVER_PORT`: Set to Render's `$PORT`.
   - `SPRING_DATASOURCE_URL`: Production MySQL JDBC URL.
   - `SPRING_DATASOURCE_USERNAME`: Production MySQL username.
   - `SPRING_DATASOURCE_PASSWORD`: Production MySQL password.
   - `SPRING_FLYWAY_ENABLED`: `true`
   - `SPRING_FLYWAY_BASELINE_ON_MIGRATE`: `true`
   - `SPRING_JPA_HIBERNATE_DDL_AUTO`: `validate`
   - `JWT_SECRET`: Random 256-bit string (at least 32 characters; default dev secret is rejected in `prod` profile).
   - `JWT_EXPIRATION_MS`: `86400000` (24 hours).
   - `CORS_ALLOWED_ORIGINS`: Deployed Vercel frontend URL.
   - `APP_ADMIN_EMAIL`: Initial administrator email (default: `admin@projectmatch.edu`).
   - `APP_ADMIN_PASSWORD`: Strong password for administrator (override default `admin123`).

---

## Database Migration Strategy (Flyway)

ProjectMatch uses **Flyway 10** for version-controlled schema migrations.
- `V1__initial_schema.sql` automatically runs when the backend starts against a clean database.
- Hibernate runs with `ddl-auto=validate`, ensuring strict schema consistency.
- **Safety Rule:** Always create a `mysqldump` backup before pointing a newly deployed backend version at an existing production database:
  ```bash
  mysqldump -u <user> -p projectmatch > pre_deploy_backup.sql
  ```

---

## Post-Deployment Verification Checklist

1. [ ] Check health endpoint returns `{"status":"UP","service":"ProjectMatch Backend API"}` at `/api/health`.
2. [ ] Verify Flyway migration version 1 has been recorded in `flyway_schema_history`.
3. [ ] Register a new student account (`/register`).
4. [ ] Log in with the registered credentials and verify JWT issuance.
5. [ ] Update student profile skills and availability.
6. [ ] Create a project and verify project-to-candidate recommendations.
7. [ ] Test nested route refresh (e.g., refresh `/dashboard` or `/teams` directly in browser).
