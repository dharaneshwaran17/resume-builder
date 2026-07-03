# Cursive — Premium Resume Builder

A premium, opinionated resume builder with live A4 preview, three ATS-friendly
templates, one-click PDF export, dark mode, and an admin analytics dashboard.

**Live app** (this repo): TanStack Start + React 19 + Tailwind v4, with
`localStorage` persistence so the demo runs entirely in the browser.

**Reference backend** (`/backend/`): a complete Spring Boot 3 + JPA + MySQL +
JWT project as static source files. It is NOT executed here — see
[`backend/README.md`](./backend/README.md) for how to run it locally.

---

## Features

- Auth (sign up / sign in / forgot password) — client-side demo; real JWT in the Java backend.
- Dashboard — stat tiles, resume grid, quick actions (edit / duplicate / delete / download).
- Editor — split view with live A4 preview, auto-save indicator, completion %, ATS score.
- Sections — personal, education, experience, projects, skills (6 categories), certificates, achievements, hobbies, languages.
- 3 templates — Classic (serif, two-column), Modern (bold accent header), Minimal (editorial serif).
- 6 accent colors, template switcher with cross-fade.
- One-click PDF export (`html2pdf.js`), print stylesheet.
- Admin dashboard — user count, resume count, downloads, top template, monthly registrations bar chart, template usage bars, users table.
- Dark mode, responsive, framer-motion animations, toast notifications.
- SEO — per-route metadata, `sitemap.xml`, `robots.txt`.

**Demo admin login:** `admin@cursive.app` / `admin123`

---

## Tech Stack

### Frontend (this repo)
- React 19, TanStack Start (Vite 7), TanStack Router
- Tailwind CSS v4 (CSS-first tokens in `src/styles.css`)
- Framer Motion, React Hook Form, React Icons, `date-fns`, `nanoid`
- `html2pdf.js` for PDF export
- Context API for auth / resumes / theme
- `localStorage` persistence

### Backend (reference, in `/backend/`)
- Java 17, Spring Boot 3, Spring Security, Spring Data JPA
- MySQL 8, BCrypt, JWT (jjwt), Bean Validation
- Maven, JUnit 5 + Mockito

---

## Project Structure

```
src/
  routes/           TanStack file-based routes
    __root.tsx      App shell (nav, providers, head)
    index.tsx       Landing + authenticated Dashboard
    auth.tsx        Sign in / up / forgot
    editor.$id.tsx  Split-view resume editor
    templates.tsx   Template browser
    admin.tsx       Admin analytics
    sitemap[.]xml.ts
  components/
    FloatingNav.tsx
    Landing.tsx
    Toaster.tsx
    editor/EditorForm.tsx
    templates/{Classic,Modern,Minimal}Template.tsx
    templates/index.tsx (renderer + registry)
    ui/*            shadcn primitives
  context/
    AuthContext.tsx
    ResumeContext.tsx
    ThemeContext.tsx
  lib/
    types.ts
    resume-factory.ts
    scoring.ts      (completion %, ATS score)
    pdf.ts          (html2pdf wrapper)
  styles.css        Design system tokens (paper/ink)

backend/            Spring Boot reference project (static source)
  pom.xml
  src/main/java/com/cursive/resume/
    controller/  service/  repository/  entity/  dto/
    config/  security/  exception/  util/
  src/main/resources/
    application.yml
    db/schema.sql
    db/sample-data.sql
```

---

## Getting Started

```bash
bun install
bun run dev
```

Open the preview URL. The app seeds a demo resume and an admin account on first
load.

### Running the reference Spring Boot backend

See [`backend/README.md`](./backend/README.md).

```bash
cd backend
# 1. Create MySQL DB and load schema
mysql -u root -p < src/main/resources/db/schema.sql
mysql -u root -p cursive < src/main/resources/db/sample-data.sql
# 2. Set env: DB_URL, DB_USER, DB_PASS, JWT_SECRET
mvn spring-boot:run
# Server on :8080
```

### Wiring the React app to the Java backend

The frontend uses `localStorage` by default. To point it at the Spring API:

1. Replace `src/context/AuthContext.tsx` calls with `axios` to
   `POST /api/auth/login`, `POST /api/auth/signup`.
2. Replace `src/context/ResumeContext.tsx` reads/writes with `axios` to
   `/api/resumes`.
3. Store the JWT from login response in `localStorage.setItem('token', jwt)`.
4. Add an axios interceptor that attaches `Authorization: Bearer <token>`.
5. Update `vite.config.ts` with a proxy: `/api → http://localhost:8080`.

The backend REST contract matches the frontend types in `src/lib/types.ts` 1:1.

---

## API Reference (backend)

All routes are `/api/*`. Authenticated routes require `Authorization: Bearer <jwt>`.

| Method | Path                        | Auth  | Purpose               |
| ------ | --------------------------- | ----- | --------------------- |
| POST   | `/api/auth/signup`          | —     | Create account        |
| POST   | `/api/auth/login`           | —     | Get JWT               |
| POST   | `/api/auth/forgot-password` | —     | Trigger reset email   |
| GET    | `/api/resumes`              | user  | List my resumes       |
| POST   | `/api/resumes`              | user  | Create resume         |
| GET    | `/api/resumes/{id}`         | user  | Get one               |
| PUT    | `/api/resumes/{id}`         | user  | Update                |
| DELETE | `/api/resumes/{id}`         | user  | Delete                |
| POST   | `/api/resumes/{id}/duplicate` | user | Duplicate           |
| POST   | `/api/resumes/{id}/download` | user  | Increment counter    |
| GET    | `/api/admin/stats`          | admin | Aggregate analytics   |
| GET    | `/api/admin/users`          | admin | List users            |

Full request/response shapes are documented in `backend/README.md`.

---

## Deployment

- **Frontend**: Any static / edge host that supports TanStack Start.
- **Backend**: Render / Railway / Fly.io — Docker image built from `backend/Dockerfile`.
- **Database**: Railway MySQL or PlanetScale.

---

## Roadmap / Future Improvements

- AI suggestions (objective, project descriptions)
- Drag-and-drop section reordering (framer-motion Reorder)
- Undo/redo history stack
- Google/Apple OAuth
- Image upload + crop for profile photo
- Two more templates (Creative, Corporate)
- Full backend integration replacing localStorage

---

## License

MIT
