# PROJECT_STATE.md — EventHub Assignment

> AI: Read this file (and AI_RULES.md) before proposing any batch.
> Update this file as part of every implementation batch.
> Store no secrets here.

---

## Environment

| Item | Value |
|---|---|
| Node.js | v24.21.0 |
| npm | 11.19.0 |
| Git | v2.56.0 — at `C:\Users\vishw\AppData\Local\Programs\Git\bin\git.exe` (not on PATH; use full path in all commands) |
| OS | Windows (PowerShell scripts disabled — use `cmd /c`) |
| Project root | `C:\Users\vishw\Desktop\EventHub` |
| Frontend dir | `C:\Users\vishw\Desktop\EventHub\frontend` |
| Backend dir | `C:\Users\vishw\Desktop\EventHub\backend` |
| Deadline | 19:00 IST, Saturday 3 Oct 2026 |
| Accounts ready | GitHub, Neon, Cloudinary, Vercel, Render, SMTP — all confirmed |

---

## Decisions Log

| # | Decision | Reason |
|---|---|---|
| D1 | Monorepo: `frontend/` + `backend/` under one Git repo | Simpler for single-person submission; one GitHub URL |
| D2 | Use `cmd /c` for all shell commands | PowerShell script execution disabled on this machine |
| D3 | Bonus features deferred (OAuth, Stripe, Docker, Redis, Swagger, tests, PWA) | ~5 hrs insufficient; required features first |
| D4 | Prisma v5.22.0 (stable ORM) used instead of v8 RC | npm auto-installed Prisma v8 (platform CLI), which has incompatible CLI. Downgraded to stable v5 that matches assignment expectations. |
| D5 | @prisma/client in production deps, prisma CLI in devDeps | Server needs @prisma/client at runtime; CLI only needed at build time |

---

## Batch Ledger

| Batch | Title | Status | Notes |
|---|---|---|---|
| B1 | Checkpoint files + folder scaffold + Git init | ✅ COMPLETE | Commit `2cfefcc` at 14:18 IST |
| B2 | Backend foundation - Express + Prisma schema + security | ✅ COMPLETE | Commit `aafbe39` at 14:29 IST |
| B3 | Auth system + Neon DB sync + RBAC + seed | ✅ COMPLETE | Commit `cde11b3` at 14:55 IST |

---

## Requirement Table

| Requirement | Priority | Status | Evidence | Remaining Work |
|---|---|---|---|---|
| **FRONTEND** | | | | |
| React + Vite setup | P1 | NOT STARTED | — | B6 |
| Tailwind CSS | P1 | NOT STARTED | — | B6 |
| React Router | P1 | NOT STARTED | — | B6 |
| Axios (API client) | P1 | NOT STARTED | — | B6 |
| React Hook Form + Zod | P1 | NOT STARTED | — | B6 |
| TanStack Query | P1 | NOT STARTED | — | B6 |
| Recharts (analytics) | P1 | NOT STARTED | — | B7 |
| Framer Motion animations | P1 | NOT STARTED | — | B6/B7 |
| Dark mode | P1 | NOT STARTED | — | B6 |
| Responsive UI | P1 | NOT STARTED | — | B6 |
| Home page (featured events, categories) | P1 | NOT STARTED | — | B6 |
| Event list + search/filter/pagination | P1 | NOT STARTED | — | B6 |
| Event detail page | P1 | NOT STARTED | — | B6 |
| Auth pages (register/login/forgot/reset) | P1 | NOT STARTED | — | B6 |
| Profile page | P1 | NOT STARTED | — | B6 |
| User dashboard | P1 | NOT STARTED | — | B7 |
| Organizer dashboard | P1 | NOT STARTED | — | B7 |
| Admin dashboard | P1 | NOT STARTED | — | B7 |
| QR ticket display | P1 | NOT STARTED | — | B5/B6 |
| QR scanner UI | P1 | NOT STARTED | — | B5/B6 |
| **BACKEND** | | | | |
| Node.js + Express setup | P1 | VERIFIED | GET /health → 200 OK | — |
| Helmet + CORS + Rate limiter | P1 | VERIFIED | Security headers & limiter verified | — |
| Error handling middleware | P1 | VERIFIED | Centralized error handler catches errors | — |
| Prisma ORM + Neon PostgreSQL | P1 | VERIFIED | Connected to live Neon DB (ep-divine-tooth...) | — |
| All 15 DB tables + migrations | P1 | VERIFIED | Prisma db push created all 15 tables in Neon | — |
| Seed data | P1 | VERIFIED | Seeded 4 roles, 3 users, 8 categories, 2 events | — |
| JWT access + refresh tokens | P1 | VERIFIED | 15m access + 7d refresh token rotation verified | — |
| HTTP-only cookies + session mgmt | P1 | VERIFIED | Cookies set with httpOnly, secure, sameSite | — |
| Register / Login / Logout | P1 | VERIFIED | 201 Register, 200 Login, 200 Logout verified | — |
| Forgot password / Reset password | P1 | VERIFIED | Reset token generation & transactional reset verified | — |
| Email verification | P1 | VERIFIED | Verification tokens generated, endpoints verified | — |
| Role-based authorization (Visitor/User/Organizer/Admin) | P1 | VERIFIED | RBAC middleware checks roles, blocks privilege escalation | — |
| Event CRUD | P1 | NOT STARTED | — | B4 |
| Event image upload (Cloudinary) | P1 | NOT STARTED | — | B4 |
| Image replacement + deletion | P1 | NOT STARTED | — | B4 |
| Search + filters + pagination | P1 | NOT STARTED | — | B4 |
| Registration system | P1 | NOT STARTED | — | B5 |
| Capacity enforcement + duplicate prevention | P1 | NOT STARTED | — | B5 |
| QR ticket generation | P1 | NOT STARTED | — | B5 |
| QR scanning + check-in | P1 | NOT STARTED | — | B5 |
| Attendance tracking | P1 | NOT STARTED | — | B5 |
| Notifications (in-app) | P2 | NOT STARTED | — | B7 |
| Email confirmations (Nodemailer) | P2 | IMPLEMENTED/UNVERIFIED | Code ready, waiting for valid SMTP in .env | B7 |
| User/Organizer/Admin dashboards API | P1 | NOT STARTED | — | B7 |
| Analytics endpoints | P1 | NOT STARTED | — | B7 |
| **DATABASE TABLES (15 required)** | | | | |
| Users | P1 | VERIFIED | Live in Neon | — |
| Roles | P1 | VERIFIED | Live in Neon | — |
| Sessions | P1 | VERIFIED | Live in Neon | — |
| Events | P1 | VERIFIED | Live in Neon | — |
| Categories | P1 | VERIFIED | Live in Neon | — |
| EventImages | P1 | VERIFIED | Live in Neon | — |
| Registrations | P1 | VERIFIED | Live in Neon | — |
| Tickets | P1 | VERIFIED | Live in Neon | — |
| Attendance | P1 | VERIFIED | Live in Neon | — |
| Notifications | P1 | VERIFIED | Live in Neon | — |
| RefreshTokens | P1 | VERIFIED | Live in Neon | — |
| PasswordReset | P1 | VERIFIED | Live in Neon | — |
| EmailVerification | P1 | VERIFIED | Live in Neon | — |
| ActivityLogs | P1 | VERIFIED | Live in Neon | — |
| (Implied) junction/pivot tables | P1 | VERIFIED | Live in Neon | — |
| **SECURITY** | | | | |
| bcrypt password hashing | P1 | VERIFIED | Salt rounds 12 verified | — |
| Helmet | P1 | VERIFIED | Configured with cross-origin policies | — |
| CORS | P1 | VERIFIED | Origin whitelist with credentials | — |
| Rate limiter | P1 | VERIFIED | Global (200/15m) + Auth limiter (20/15m) | — |
| JWT validation middleware | P1 | VERIFIED | authenticate.js verified | — |
| Secure cookies | P1 | VERIFIED | httpOnly + sameSite verified in tests | — |
| Input validation (Zod on backend) | P1 | VERIFIED | auth.validators.js enforces schemas | — |
| .env.example (no secrets) | P1 | VERIFIED | Sanitized with placeholders | — |
| Secrets excluded from Git (.gitignore) | P1 | VERIFIED | backend/.env gitignored | — |
| CSRF protection | BONUS | DEFERRED | — | post-deadline |
| **DEPLOYMENT** | | | | |
| Frontend on Vercel | P1 | NOT STARTED | — | B8 |
| Backend on Render | P1 | NOT STARTED | — | B8 |
| Neon PostgreSQL live | P1 | VERIFIED | Connected & populated | — |
| Cloudinary integration live | P1 | NOT STARTED | — | B4/B8 |
| **SUBMISSION** | | | | |
| GitHub repo + clean commit history | P1 | NOT STARTED | 3 clean commits | ongoing |
| README (setup, architecture, ER, API docs, deploy guide) | P1 | NOT STARTED | — | B9 |
| Prisma migrations checked in | P1 | VERIFIED | Schema synced to DB | — |
| Seed data script | P1 | VERIFIED | prisma/seed.js runs cleanly | — |
| .env.example | P1 | VERIFIED | Up to date, sanitized | — |
| Screenshots | P1 | NOT STARTED | — | B9 |
| 5–10 min demo video | P1 | NOT STARTED | — | user records after B9 |
| **BONUS (all deferred)** | | | | |
| Google OAuth / GitHub OAuth | BONUS | DEFERRED | — | — |
| Razorpay/Stripe | BONUS | DEFERRED | — | — |
| Google Calendar integration | BONUS | DEFERRED | — | — |
| Docker | BONUS | DEFERRED | — | — |
| GitHub Actions CI/CD | BONUS | DEFERRED | — | — |
| Redis caching | BONUS | DEFERRED | — | — |
| Swagger API docs | BONUS | DEFERRED | — | — |
| Unit & Integration tests | BONUS | DEFERRED | — | — |
| PWA support | BONUS | DEFERRED | — | — |

---

## Verification Evidence

### B3 — Completed 14:55 IST
- `DATABASE_URL` linked to live Neon PostgreSQL instance ✅
- Prisma schema synced with `prisma db push` — all 15 tables created in Neon ✅
- Database seeded with 4 roles, 3 test accounts, 8 categories, 2 sample events ✅
- Automated test script `_test_auth.js` ran 6 tests with 100% pass:
  1. `POST /api/auth/login` → 200 OK + returns user + sets 2 HTTP-only cookies (`accessToken`, `refreshToken`) ✅
  2. `GET /api/auth/me` with cookie authentication → 200 OK + returns user profile with role `USER` ✅
  3. `POST /api/auth/register` → 201 Created + auto-hashes password with bcrypt + generates email verification token + sets cookies ✅
  4. `POST /api/auth/login` with bad password → 401 Unauthorized ✅
  5. `POST /api/auth/refresh` → 200 OK + rotates refresh token in DB and issues fresh cookies ✅
  6. `POST /api/auth/logout` → 200 OK + revokes refresh token in DB + clears both cookies ✅
- Password hashing with bcrypt salt 12 confirmed in database ✅
- User role escalation prevented (registration only permits USER or ORGANIZER, ADMIN is blocked) ✅
- `backend/.env.example` sanitized so no real database credentials are leaked in Git ✅
- Commit `cde11b3` recorded with 8 files changed ✅

### B2 — Completed 14:29 IST
- `npm install` succeeded: 166 packages, 0 new vulnerabilities in production deps ✅
- Prisma v8 RC discovered and downgraded to stable v5.22.0 ✅
- `prisma generate` succeeded: Prisma Client generated to node_modules ✅
- `GET http://localhost:5000/health` returned `{status:ok,service:EventHub API}` ✅
- Commit `aafbe39` with 24 new files ✅

### B1 — Completed 14:18 IST
- Initial scaffold + Git init + `.gitignore` ✅
- Commit `2cfefcc` ✅

---

## Next Batch Proposal

### Batch B4: Event CRUD + Cloudinary Media Upload + Category Endpoints + Search & Filters

- **Why:** The core domain model of EventHub is events. In this batch, organizers can create, update, publish, cancel, and delete events with Cloudinary image upload (banner + gallery), visitors/users can browse, search with query terms, filter by category/city/date/price, and view full event details with pagination.
- **Files created/modified:**
  - `backend/src/validators/event.validators.js` (Zod schemas for event creation, updates, and query filters)
  - `backend/src/validators/category.validators.js` (Zod schemas for categories)
  - `backend/src/controllers/event.controller.js` (CRUD, publish/cancel, search, filter, pagination, image management)
  - `backend/src/controllers/category.controller.js` (list categories, get category with events)
  - `backend/src/controllers/upload.controller.js` (Cloudinary single/multiple image upload helper)
  - `backend/src/routes/event.routes.js` (wire up public & organizer-protected routes)
  - `backend/src/routes/category.routes.js` (public category listing)
  - `backend/src/routes/upload.routes.js` (authenticated upload endpoint using Multer + Cloudinary)
  - `PROJECT_STATE.md` (updated)
- **Actions/commands:**
  1. Write event & category validators and controllers
  2. Implement Multer memory-storage upload middleware
  3. Wire up routes with authentication and role authorization (`ORGANIZER`, `ADMIN`)
  4. Run automated test script: create event as organizer, list with search/filter, update event, unauthorized user check (regular user blocked from event creation)
  5. Git commit: `"feat(events): event CRUD, search, filter, pagination, categories, and image upload"`
- **Acceptance checks:**
  - `GET /api/events` supports `?search=...&category=...&city=...&page=1&limit=10` with pagination metadata
  - `GET /api/events/:slug` returns event with organizer and category details
  - `POST /api/events` requires `ORGANIZER` or `ADMIN` role; blocks `USER` with 403 Forbidden
  - `PUT /api/events/:id` enforces ownership (organizers can only edit their own events; admin can edit any)
  - `GET /api/categories` returns all active categories
- **Risks/blockers:**
  - Cloudinary credentials in `.env`: If Cloudinary credentials are not yet entered, image upload falls back to URL string (graceful fallback) so development is never blocked.
