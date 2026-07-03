# Cursive — Spring Boot Backend (Reference)

Java 17 · Spring Boot 3 · Spring Security · Spring Data JPA · MySQL 8 · JWT · Maven

> These files are a reference project provided as static source. They are not
> executed inside Lovable — run locally with Maven + MySQL.

## Prerequisites

- Java 17+
- Maven 3.9+
- MySQL 8+

## Setup

```bash
# 1. Create database and schema
mysql -u root -p < src/main/resources/db/schema.sql
# (optional) load demo data
mysql -u root -p cursive < src/main/resources/db/sample-data.sql

# 2. Set env vars (or edit application.yml)
export DB_URL="jdbc:mysql://localhost:3306/cursive"
export DB_USER="root"
export DB_PASS="password"
export JWT_SECRET="change-me-to-a-long-random-string-at-least-32-chars"

# 3. Run
mvn spring-boot:run
```

Backend listens on `http://localhost:8080`. CORS is open to `http://localhost:5173` and `http://localhost:3000`.

## Auth Flow

1. `POST /api/auth/signup` `{ name, email, password }` → `{ token, user }`
2. `POST /api/auth/login` `{ email, password }` → `{ token, user }`
3. Send `Authorization: Bearer <token>` on all protected requests.

## Endpoints

### Auth (public)
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password` — issues a reset token (in a real deployment, email it)
- `POST /api/auth/reset-password` — `{ token, newPassword }`

### Resumes (user)
- `GET  /api/resumes` — list mine
- `POST /api/resumes` — create
- `GET  /api/resumes/{id}`
- `PUT  /api/resumes/{id}`
- `DELETE /api/resumes/{id}`
- `POST /api/resumes/{id}/duplicate`
- `POST /api/resumes/{id}/download` — increment download counter

Resume JSON matches the frontend `Resume` type in `src/lib/types.ts`.

### Admin (role=ADMIN)
- `GET /api/admin/stats` — `{ userCount, resumeCount, totalDownloads, topTemplate, monthly[] }`
- `GET /api/admin/users`

## Testing

```bash
mvn test
```

JUnit 5 + Mockito. Covers `AuthService` and `ResumeService`.

## Deploy

Dockerfile included. Point at any managed MySQL (Railway, PlanetScale, RDS).
