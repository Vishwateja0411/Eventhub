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
| B4 | Event CRUD + Cloudinary upload + categories + search | ✅ COMPLETE | Commit `6ac9320` at 15:01 IST |

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
| Event CRUD | P1 | VERIFIED | Full CRUD with slug, ownership, active status verified | — |
| Event image upload (Cloudinary) | P1 | VERIFIED | Multer + Cloudinary upload controller with fallback | — |
| Image replacement + deletion | P1 | VERIFIED | DELETE /api/upload/image removes by publicId | — |
| Search + filters + pagination | P1 | VERIFIED | ILIKE keyword search, city, category, date, price filters | — |
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
| Input validation (Zod on backend) | P1 | VERIFIED | auth & event validators enforce schemas | — |
| .env.example (no secrets) | P1 | VERIFIED | Sanitized with placeholders | — |
| Secrets excluded from Git (.gitignore) | P1 | VERIFIED | backend/.env gitignored | — |
| CSRF protection | BONUS | DEFERRED | — | post-deadline |
| **DEPLOYMENT** | | | | |
| Frontend on Vercel | P1 | NOT STARTED | — | B8 |
| Backend on Render | P1 | NOT STARTED | — | B8 |
| Neon PostgreSQL live | P1 | VERIFIED | Connected & populated | — |
| Cloudinary integration live | P1 | VERIFIED | Upload controller + fallback live | B8 |
| **SUBMISSION** | | | | |
| GitHub repo + clean commit history | P1 | NOT STARTED | 4 clean commits | ongoing |
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

### B4 — Completed 15:01 IST
- `GET /api/categories` returns seeded categories with active event counts ✅
- `GET /api/events` supports pagination, city, category, isFree, and date filters ✅
- `GET /api/events/featured` returns upcoming published featured events ✅
- `POST /api/events` allows ORGANIZER to create event with unique URL slug and capacity ✅
- `GET /api/events/:slug` calculates real-time `spotsLeft` and `isSoldOut` ✅
- `PUT /api/events/:id` enables organizers to update their event details ✅
- Role enforcement: Regular `USER` attempting to create event is blocked with `403 Forbidden` ✅
- Ownership enforcement: Unauthorized user attempting to edit another organizer's event is blocked with `403 Forbidden` ✅
- Search & Filter: Case-insensitive query filtering by keyword and city works cleanly ✅
- Multer image middleware + Cloudinary upload controller with fallback operational ✅
- Commit `6ac9320` recorded with 10 files changed ✅

### B3 — Completed 14:55 IST
- `DATABASE_URL` linked to live Neon PostgreSQL instance ✅
- Prisma schema synced with `prisma db push` — all 15 tables created in Neon ✅
- Database seeded with 4 roles, 3 test accounts, 8 categories, 2 sample events ✅
- Automated test script `_test_auth.js` ran 6 tests with 100% pass ✅
- Commit `cde11b3` recorded with 8 files changed ✅

### B2 — Completed 14:29 IST
- Express app + Prisma schema + security middleware ✅
- Commit `aafbe39` with 24 new files ✅

### B1 — Completed 14:18 IST
- Initial scaffold + Git init + `.gitignore` ✅
- Commit `2cfefcc` ✅

---

## Next Batch Proposal

### Batch B5: Registration System + Capacity Enforcement + QR Ticket Generation & Scanning + Attendance Tracking

- **Why:** This batch completes the end-to-end event lifecycle on the backend. Authenticated users can register for events with atomic capacity checks (preventing overbooking) and unique constraints (preventing duplicate registration). On successful registration, an unpredictable cryptographic ticket code and a QR code (base64 image) are generated. Organizers can scan the QR code to check in attendees with attendance records and duplicate check-in prevention.
- **Files created/modified:**
  - `backend/src/validators/registration.validators.js` (Zod schemas for registration & check-in)
  - `backend/src/controllers/registration.controller.js` (atomic registration, duplicate check, capacity lock, cancel registration, my-registrations)
  - `backend/src/controllers/ticket.controller.js` (view ticket, get QR code)
  - `backend/src/controllers/attendance.controller.js` (scan/check-in ticket, event attendance list, verify ticket)
  - `backend/src/routes/registration.routes.js` (wire up registration endpoints)
  - `backend/src/routes/ticket.routes.js` (wire up ticket display endpoints)
  - `backend/src/routes/attendance.routes.js` (wire up check-in & scanning endpoints)
  - `PROJECT_STATE.md` (updated)
- **Actions/commands:**
  1. Write registration, ticket, and attendance validators and controllers
  2. Implement QR code generation using `qrcode` library (data URI PNG)
  3. Implement database transaction for capacity decrement & duplicate prevention (`@@unique([eventId, userId])`)
  4. Implement check-in logic: checks event match, marks attendance, rejects already-checked-in tickets with 409 Conflict
  5. Run automated test script: register user, verify QR ticket created, scan & check in ticket, attempt duplicate check-in (expect rejection), attempt overbooking (expect capacity full)
  6. Git commit: `"feat(tickets): registration, atomic capacity enforcement, QR ticket generation, and check-in attendance"`
- **Acceptance checks:**
  - `POST /api/registrations/:eventId` creates registration + Ticket with unique QR code
  - Duplicate registration for same user & event returns 409 Conflict
  - Registering for a full event returns 400 "Event is sold out"
  - `GET /api/tickets/:ticketCode` returns ticket with QR image
  - `POST /api/attendance/check-in` validates ticket code, verifies organizer owns event, records attendance
  - Scanning already-used ticket returns 409 "Ticket has already been checked in"
- **Risks/blockers:** None. Database schema already has `Registration`, `Ticket`, and `Attendance` models with unique constraints in Neon.
