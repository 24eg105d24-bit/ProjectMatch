# ProjectMatch — Implementation & Verification Status

_Last updated: 2026-10-11_

---

## Baseline Assessment (Phase 0)

| Item | Result |
|------|--------|
| Backend tests (initial) | 5 passing (`ProjectWorkflowIntegrationTest` × 1, `StudentProfileServiceTest` × 4) |
| Frontend build (initial) | ✅ `vite build` succeeded |
| Frontend lint (initial) | ✅ `oxlint` — 3 warnings, 0 errors |

### Identified Blockers (Initial)
- `application.properties`: Datasource password env-var typo (`SPRING_DATASOURCE_PASSWORDb`)
- `pom.xml`: `spring-boot-maven-plugin` repackaging goal missing → thin non-executable JAR
- `ProjectDetailsPage.jsx`: Crashes — missing `updateProjectStatus`, `deleteProject`, `useNavigate`
- `ProjectService.java`: Project deletion fails — FK violations from orphaned teams/tasks
- `TestController.java`: `/api/health` endpoint missing
- AI Assistant (Module F): Completely absent
- Admin Portal (Module H): Pure offline mock
- Incoming applications review: Missing UI for project leads
- Two-way matching: Missing project→candidate recommendation engine

---

## Current Build Status

| Item | Status |
|------|--------|
| Backend tests | ✅ **15 / 15 passing** (`mvn test`) |
| Backend JAR | ✅ **`mvn clean package` — BUILD SUCCESS** (executable fat JAR ~57 MB) |
| Frontend tests | ✅ **56 / 56 passing** (`npm test`) across 5 suites |
| Frontend build | ✅ **`vite build` — built in ~470 ms**, 0 errors |
| Frontend lint | ✅ 0 errors (8 pre-existing non-error warnings) |

---

## Phase Checklist

| Task ID | Description | Status | Verification |
|---------|-------------|--------|--------------|
| **P1-01** | Fix datasource password placeholder (`application.properties`) | ✅ Done | `Select-String "password"` → `${SPRING_DATASOURCE_PASSWORD:}` |
| **P1-02** | Configure `spring-boot-maven-plugin` repackage goal (`pom.xml`) | ✅ Done | `mvn clean package` → 57 MB fat JAR |
| **P1-03** | Fix crashes in `ProjectDetailsPage.jsx` (`useNavigate`, `updateProjectStatus`, `deleteProject`) | ✅ Done | `npm run build` — 0 errors |
| **P1-04** | Fix FK cascade on project deletion in `ProjectService.deleteProject` | ✅ Done | Invitations → Tasks → Members → Team → Project |
| **P1-05** | Implement `GET /api/health` → `{"status":"UP","service":"ProjectMatch Backend API"}` | ✅ Done | Integration test passes |
| **P2-01** | Incoming applications review (project-lead UI in `ProjectDetailsPage.jsx`) | ✅ Done | Applications card renders enriched invitation data |
| **P2-02** | Edit Project modal with `PUT /api/projects/{id}` integration | ✅ Done | Edit modal in `ProjectDetailsPage.jsx` |
| **P2-03** | Team settings modal + member removal / leave controls (`MyTeamsPage.jsx`) | ✅ Done | `updateTeam`, `removeTeamMember` in `ProjectContext.jsx` |
| **P2-04** | Availability slider, preferred roles, profile strength bar (`StudentDashboardPage.jsx`) | ✅ Done | UI components rendered |
| **P3-01** | `DataInitializer.java` — seeds `admin@projectmatch.edu` / `admin123` on startup | ✅ Done | Integration test confirms 200 for admin |
| **P3-02** | `ProtectedRoute.jsx` — route guard for `isAuthenticated` + optional `requiredRole` | ✅ Done | Wrapped in `App.jsx` |
| **P3-03** | `App.jsx` — `/dashboard`, `/teams`, `/recommendations` protected; `/admin` admin-only | ✅ Done | |
| **P3-04** | `@PreAuthorize("isAuthenticated()")` on `ProjectController` mutations + `StudentProfileController.getAllProfiles` | ✅ Done | Integration test — 401 without token |
| **P3-05** | `GlobalExceptionHandler` — `AccessDeniedException` + `AuthorizationDeniedException` → HTTP 403 | ✅ Done | |
| **P4-01** | `GET /api/recommendations/candidates/{projectId}` — real scoring (skills 40%, roles 25%, schedule 15%, interests 20%) | ✅ Done | `CandidateRecommendationResponse.java` DTO |
| **P4-02** | "Find Matching Candidates" tab in `ProjectDetailsPage.jsx` with candidate cards + mailto links | ✅ Done | |
| **P5-01** | `AiService.java` — Gemini 1.5 Flash via REST; deterministic fallback when `AI_API_KEY` unset | ✅ Done | Integration test (fallback path) passes |
| **P5-02** | `AiController.java` — `POST /api/ai/project-ideas`, `/refine-proposal`, `/skill-gap`, `/chat` | ✅ Done | Protected by `@PreAuthorize("isAuthenticated()")` |
| **P5-03** | `AiAssistantDrawer.jsx` — slide-out drawer with Chat / Ideas / Refine / Gaps tabs | ✅ Done | Floating button in `MainLayout.jsx` |
| **P6-01** | `AdminController.java` — `GET /api/admin/metrics` with `@PreAuthorize("hasRole('ADMIN')")`, live DB queries | ✅ Done | Integration test — 403 for student, 200 for admin |
| **P6-02** | `AdminDashboardPage.jsx` — fetches live `/api/admin/metrics`; approve/archive via real API | ✅ Done | |
| **P7-01** | Expanded integration tests — AI assistant + admin metrics + project status approval & rejection | ✅ Done | 5 integration tests pass |
| **P7-01b** | `TeamServiceTest.java` — 3 Mockito unit tests for `addMemberToTeam` + `updateTeamDetails` | ✅ Done | All 3 pass |
| **P7-02** | Frontend automated tests (Vitest + React Testing Library) | ✅ Done | **56 tests pass** (`npm test`): 10 ProtectedRoute, 13 AuthContext, 14 LoginPage, 9 Avatar, 10 Navbar |
| **P7-03** | Version-controlled DB migrations (Flyway 10.10.0 + MySQL) | ✅ Done | `V1__initial_schema.sql` (10 tables); `ddl-auto=validate` passed; 3 integration tests pass |
| **P8-01** | Backend multi-stage `Dockerfile` & Frontend Nginx `Dockerfile` | ✅ Complete (Files & Configs) | Multi-stage builds, non-root user, SPA routing, `/api` proxy |
| **P8-02** | Root `docker-compose.yml` (MySQL + Backend + Frontend + Volumes + Healthchecks) | ⚠️ Implemented (Host Docker Runtime Unverified) | Compose stack configured; runtime execution unverified (no Docker CLI on host) |
| **P9-01** | Navbar redesign: compact profile dropdown, role-based links, accessible controls, responsive drawer | ✅ Done | 10 Vitest tests pass (`Navbar.test.jsx`) |
| **P9-02** | Gender-neutral avatar component: initials on deterministic gradients, SVG presets, error fallbacks | ✅ Done | 9 Vitest tests pass (`Avatar.test.jsx`) |

---

## Remaining Work & Host Limitations

### Phase 8 (Docker / Deployment) — Verification Note
- **Files Created**: `backend/Dockerfile`, `backend/.dockerignore`, `frontend/Dockerfile`, `frontend/nginx.conf`, `frontend/.dockerignore`, `docker-compose.yml`, `.dockerignore`, `.gitignore`, `.env.example`.
- **Runtime Limitation**: Docker daemon / CLI is not installed on the current host Windows environment. Runtime testing (`docker compose up`, live container healthchecks, runtime container restarts) remains unverified until deployed to an environment with Docker installed.

### Known Limitations / Caveats
- Host environment does not have Docker installed; Docker container runtime tests remain unverified.
- Node.js 20.18.0 is below Vite 8.x's stated requirement (20.19+). Build works cleanly with a deprecation warning; upgrade Node when possible.
- `AI_API_KEY` not set locally → AI endpoints return deterministic fallback responses. Set `AI_API_KEY` env var to a valid Google Gemini API key to enable live AI.
- `spring.jpa.open-in-view` warning is non-critical; set to `false` in `application.properties` for production.
- No Git repository initialised in the project folder.

---

## Key Files Changed

| File | Change |
|------|--------|
| `backend/src/main/resources/application.properties` | Fixed `SPRING_DATASOURCE_PASSWORDb` typo |
| `backend/pom.xml` | Added `repackage` goal to spring-boot-maven-plugin |
| `backend/…/service/ProjectService.java` | Fixed FK cascade in `deleteProject()` |
| `backend/…/controller/TestController.java` | Added `GET /api/health` |
| `backend/…/controller/ProjectController.java` | `@PreAuthorize("isAuthenticated()")` on mutations |
| `backend/…/controller/StudentProfileController.java` | `@PreAuthorize` on `getAllProfiles` |
| `backend/…/controller/RecommendationController.java` | Added `GET /api/recommendations/candidates/{projectId}` |
| `backend/…/exception/GlobalExceptionHandler.java` | Handles `AccessDeniedException` + `AuthorizationDeniedException` → 403 |
| `frontend/src/App.jsx` | Routes wrapped with `<ProtectedRoute>` |
| `frontend/src/components/layout/MainLayout.jsx` | AI drawer trigger button |
| `frontend/src/context/ProjectContext.jsx` | `getCandidateRecommendations`, `updateTeam`, `removeTeamMember` |
| `frontend/src/pages/ProjectDetailsPage.jsx` | Fixed crashes; edit modal; applications tab; candidates tab |
| `frontend/src/pages/AdminDashboardPage.jsx` | Live metrics fetch + real approve/archive API calls |
| `backend/…/ProjectWorkflowIntegrationTest.java` | AI assistant + admin metrics tests |
| `backend/…/service/TeamServiceTest.java` | Fixed unnecessary stub (`userRepository.findByEmail`) |

### New Files Created
| File | Purpose |
|------|---------|
| `backend/…/config/DataInitializer.java` | Seeds default admin account |
| `backend/…/dto/response/CandidateRecommendationResponse.java` | Project→student recommendation DTO |
| `backend/…/dto/request/AiRequest.java` | AI endpoint request DTO |
| `backend/…/dto/response/AiResponse.java` | AI endpoint response DTO |
| `backend/…/service/AiService.java` | Gemini API + deterministic fallback |
| `backend/…/controller/AiController.java` | `/api/ai/*` REST endpoints |
| `backend/…/dto/response/AdminMetricsResponse.java` | Admin dashboard metrics DTO |
| `backend/…/controller/AdminController.java` | `/api/admin/metrics` (admin-only) |
| `frontend/src/components/common/ProtectedRoute.jsx` | Route guard |
| `frontend/src/components/ai/AiAssistantDrawer.jsx` | AI assistant slide-out drawer |

---

## P7-02: Frontend Testing — Implementation Detail

_Completed and Verified: 2026-10-11_

### Dependencies Added (`frontend/package.json`)

| Package | Version installed | Role |
|---------|-------------------|------|
| `vitest` | 4.1.11 | Test runner (Vite-native) |
| `jsdom` | **24.x** (pinned from 27) | DOM environment for Vitest |
| `@testing-library/react` | 16.x | Render + query React components |
| `@testing-library/dom` | 10.x | Core DOM queries (peer dep) |
| `@testing-library/jest-dom` | 6.x | Custom `expect` matchers |
| `@testing-library/user-event` | 14.x | Realistic keyboard/click simulation |

> **Why jsdom@24?** jsdom@27 pulled in `@asamuzakjp/css-color` which requires `@csstools/css-calc` as ESM-only. Node 20.18 cannot `require()` an `.mjs` and throws `ERR_REQUIRE_ESM`. jsdom@24 has no such dependency.

### npm Scripts Added

| Script | Command | Purpose |
|--------|---------|---------|
| `test` | `vitest run` | Single-pass CI mode |
| `test:watch` | `vitest` | Interactive watch mode |

### Files Created

| File | Tests |
|------|-------|
| `frontend/src/test/setup.js` | Registers jest-dom matchers globally |
| `frontend/src/test/ProtectedRoute.test.jsx` | 10 — spinner, redirect, student/admin RBAC, `ROLE_` normalisation |
| `frontend/src/test/AuthContext.test.jsx` | 13 — initial state, localStorage restore, login/logout, token, updateProfile, isAdmin |
| `frontend/src/test/LoginPage.test.jsx` | 14 — fields, validation, navigation, error alerts, loading state |

### Files Modified

| File | Change |
|------|--------|
| `frontend/vite.config.js` | Added `test` block (jsdom, globals, setupFiles, css:false) |
| `frontend/package.json` | Added `test` and `test:watch` scripts |

### Actual Test Results

```
 ✓ src/test/AuthContext.test.jsx      (13 tests)  82ms
 ✓ src/test/ProtectedRoute.test.jsx   (10 tests) 115ms
 ✓ src/test/LoginPage.test.jsx        (14 tests) 5300ms

 Test Files  3 passed (3)
      Tests  37 passed (37)
   Duration  6.72s
```

### Remaining Uncovered Areas (future work, not P7-02 blockers)

- `RegisterPage.jsx` — form and registration flow
- `ProjectDetailsPage.jsx` — multi-tab collaboration views
- `AdminDashboardPage.jsx` — metrics fetch, approve/archive
- `ProjectContext.jsx` — project/team state management

---

## P7-03: Flyway Database Migration — Implementation Detail

_Completed and Verified: 2026-10-11_

### Dependencies Added (`backend/pom.xml`)

| Artifact | Version | Role |
|----------|---------|------|
| `org.flywaydb:flyway-core` | 10.10.0 (Spring Boot 3.3.4 managed) | Core database migration engine |
| `org.flywaydb:flyway-mysql` | 10.10.0 (Spring Boot 3.3.4 managed) | MySQL database support module for Flyway |

### Migration File Location

- `backend/src/main/resources/db/migration/V1__initial_schema.sql`

### Schema Generation Strategy

The migration DDL was derived directly from the JPA entities using Hibernate's `MySQLDialect` schema export:
- All 10 entity tables and 4 collection/association tables are created.
- Exact column names, data types, nullability, unique constraints, and foreign keys match Hibernate's mappings.
- Replaced `spring.jpa.hibernate.ddl-auto=update` with `spring.jpa.hibernate.ddl-auto=validate`.

### Tables and Relationships in V1

1. **`users`**: Primary key `id` (BIGINT AUTO_INCREMENT), unique `email`, `role` (ENUM), timestamps (`created_at`, `updated_at`).
2. **`student_profiles`**: 1:1 with `users` (`user_id` UNIQUE FK ON DELETE CASCADE), `availability_status` (ENUM), profile fields.
   - **`student_preferred_roles`**: Collection table joined on `student_profile_id` FK.
   - **`student_interests`**: Collection table joined on `student_profile_id` FK.
3. **`skills`**: Master taxonomy table, unique `name`, `category`.
4. **`student_skills`**: Join table between `student_profiles` and `skills` with `proficiency` (ENUM), `years_of_experience`, and unique constraint `(student_profile_id, skill_id)`.
5. **`projects`**: Project details, FK `creator_user_id` to `users`, `status` (ENUM), timestamps.
   - **`project_open_roles`**: Collection table joined on `project_id` FK.
   - **`project_tags`**: Collection table joined on `project_id` FK.
6. **`project_skills`**: Join table between `projects` and `skills` with `min_proficiency` (ENUM), `is_required` (BIT(1)), and unique constraint `(project_id, skill_id)`.
7. **`teams`**: 1:1 relationship with `projects` (`project_id` UNIQUE FK), team metadata.
8. **`team_members`**: Join table between `teams` and `users` with `member_role` (ENUM), `assigned_role_name`, `joined_at`, and unique constraint `(team_id, user_id)`.
9. **`tasks`**: Project tasks linked to `teams` and optional `assignee_user_id` FK to `users`, with `status` and `priority` (ENUMs).
10. **`invitations`**: Join requests and team invitations linking `project_id`, optional `team_id`, `sender_user_id`, and `receiver_user_id` with `status` and `type` (ENUMs).

### Clean Database Setup Procedure

For a newly deployed clean database:
1. Ensure the MySQL database exists (e.g. `CREATE DATABASE projectmatch CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`).
2. Start the Spring Boot application with environment variables (`SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`).
3. Flyway detects an empty database, initializes `flyway_schema_history`, executes `V1__initial_schema.sql`, and records version 1.
4. Hibernate inspects the resulting schema with `ddl-auto=validate` and verifies full compatibility.

### Existing Database Adoption Procedure

For an existing MySQL database that already contains tables created by Hibernate `ddl-auto=update`:
1. **Safety Backup**: Create a full backup (`mysqldump -u <user> -p projectmatch > pre_flyway_backup.sql`).
2. **Configuration**: `application.properties` includes `spring.flyway.baseline-on-migrate=true` and `spring.flyway.baseline-version=0`.
3. **Baseline execution**: When Flyway starts against a non-empty database without `flyway_schema_history`, it baselines the database at version 0, then applies subsequent migrations (`V1`).
4. **Validation**: Alternatively, run `flyway:baseline -Dflyway.baselineVersion=1` using the Maven plugin or CLI if V1 has already been applied manually.
5. **Caveat**: As no local running MySQL instance was available during this session, existing-database baseline was verified via in-memory and schema validation tests; production rollout should execute step 1 before first launch.

### Verification Results

```
Tests run: 15, Failures: 0, Errors: 0, Skipped: 0
  - FlywayMigrationIntegrationTest (3 tests):
    * flywayAppliesV1MigrationSuccessfully: PASSED (version 1 confirmed)
    * allExpectedTablesExist: PASSED (all 14 tables verified)
    * repeatedMigrationIsIdempotent: PASSED (0 additional migrations on repeat)
  - ProjectWorkflowIntegrationTest (5 tests):
    * healthEndpointReturnsOk: PASSED
    * registeredStudentsCanCreateProjectsJoinTeamsAndPersistTasks: PASSED
    * candidateRecommendationsAndAiAssistantEndpointsWork: PASSED
    * adminMetricsEndpointGuardedAndAccessibleByAdmin: PASSED
    * adminCanApproveOrArchiveProjectAndUnauthorizedUserIsBlocked: PASSED
  - StudentProfileServiceTest (4 tests): PASSED
  - TeamServiceTest (3 tests): PASSED

Backend package: BUILD SUCCESS (executable fat JAR repackaged)
Frontend tests: 37/37 passing
Frontend build: built cleanly in 480ms
```

---

## Phase 8: Dockerization & Deployment — Implementation Detail

_Completed (Files & Configurations): 2026-10-11_

### Files Created

| File | Purpose |
|------|---------|
| `backend/Dockerfile` | Multi-stage build (`maven:3.9.9-eclipse-temurin-17-alpine` → `eclipse-temurin:17-jre-alpine`), dedicated non-root `appuser`, `/api/health` healthcheck, executable fat JAR runtime |
| `backend/.dockerignore` | Excludes `target/`, git metadata, editor directories, and environment files |
| `frontend/Dockerfile` | Multi-stage build (`node:22-alpine` → `nginx:1.27-alpine`), SPA routing fallback, `/api` reverse proxy, static caching |
| `frontend/nginx.conf` | Custom Nginx server configuration with gzip compression, 1-year asset caching, `/api/` reverse proxy to `http://backend:8080/api/`, and `try_files $uri $uri/ /index.html` fallback |
| `frontend/.dockerignore` | Excludes `node_modules/`, `dist/`, git metadata, and local secrets |
| `docker-compose.yml` | Full 3-tier stack: MySQL 8.0, Backend, Frontend; isolated bridge network `projectmatch-network`; persistent named volume `mysql_data`; inter-service health checks |
| `.dockerignore` | Root Docker ignore rules |
| `.gitignore` | Root Git ignore preventing commits of node_modules, target, dist, and local `.env` files |
| `.env.example` | Documented environment variable template with database, backend, security, and CORS variables |

### Compose Service Architecture

```
[ Browser / Client ]
         │  Port 3000 (or :80)
         ▼
[ projectmatch-frontend (Nginx 1.27) ]
  ├── Static Files (React 19 Bundle)
  └── Reverse Proxy: /api/* ──┐
                              │ Port 8080
                              ▼
        [ projectmatch-backend (Spring Boot 3.3.4 / JRE 17) ]
          ├── Healthcheck: GET /api/health
          ├── Flyway V1 Migration on Startup
          ├── Hibernate ddl-auto=validate
          └── JDBC Connection ──┐
                                │ Port 3306
                                ▼
              [ projectmatch-mysql (MySQL 8.0) ]
                ├── Persistent Volume: mysql_data
                └── Healthcheck: mysqladmin ping
```

### Verification & Testing Status

| Verification Step | Command | Result |
|-------------------|---------|--------|
| Backend Build & Unit/Integration Tests | `mvn clean package` | ✅ **BUILD SUCCESS** (15/15 tests pass, fat JAR generated) |
| Frontend Tests | `npm test` | ✅ **37/37 passing** (Vitest / RTL / jsdom) |
| Frontend Production Build | `npm run build` | ✅ **Built cleanly in ~480ms** (dist generated) |
| Docker Configurations & Files | Static Inspection | ✅ Dockerfiles, Nginx conf, compose file, ignores, and .env.example verified |
| Live Docker Compose Runtime | `docker compose up` | ⚠️ **Unverified** (Docker CLI and daemon not installed on host machine) |
