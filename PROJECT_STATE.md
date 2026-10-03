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
| Node.js + Express setup | P1 | NOT STARTED | — | B2 |
| Helmet + CORS + Rate limiter | P1 | NOT STARTED | — | B2 |
| Error handling middleware | P1 | NOT STARTED | — | B2 |
| Prisma ORM + Neon PostgreSQL | P1 | NOT STARTED | — | B2 |
| All 15 DB tables + migrations | P1 | NOT STARTED | — | B2 |
| Seed data | P1 | NOT STARTED | — | B2/B9 |
| JWT access + refresh tokens | P1 | NOT STARTED | — | B3 |
| HTTP-only cookies + session mgmt | P1 | NOT STARTED | — | B3 |
| Register / Login / Logout | P1 | NOT STARTED | — | B3 |
| Forgot password / Reset password | P1 | NOT STARTED | — | B3 |
| Email verification | P1 | NOT STARTED | — | B3 |
| Role-based authorization (Visitor/User/Organizer/Admin) | P1 | NOT STARTED | — | B3 |
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
| Email confirmations (Nodemailer) | P2 | NOT STARTED | — | B7 |
| User/Organizer/Admin dashboards API | P1 | NOT STARTED | — | B7 |
| Analytics endpoints | P1 | NOT STARTED | — | B7 |
| **DATABASE TABLES (15 required)** | | | | |
| Users | P1 | NOT STARTED | — | B2 |
| Roles | P1 | NOT STARTED | — | B2 |
| Sessions | P1 | NOT STARTED | — | B2 |
| Events | P1 | NOT STARTED | — | B2 |
| Categories | P1 | NOT STARTED | — | B2 |
| EventImages | P1 | NOT STARTED | — | B2 |
| Registrations | P1 | NOT STARTED | — | B2 |
| Tickets | P1 | NOT STARTED | — | B2 |
| Attendance | P1 | NOT STARTED | — | B2 |
| Notifications | P1 | NOT STARTED | — | B2 |
| RefreshTokens | P1 | NOT STARTED | — | B2 |
| PasswordReset | P1 | NOT STARTED | — | B2 |
| EmailVerification | P1 | NOT STARTED | — | B2 |
| ActivityLogs | P1 | NOT STARTED | — | B2 |
| (Implied) junction/pivot tables | P1 | NOT STARTED | — | B2 |
| **SECURITY** | | | | |
| bcrypt password hashing | P1 | NOT STARTED | — | B3 |
| Helmet | P1 | NOT STARTED | — | B2 |
| CORS | P1 | NOT STARTED | — | B2 |
| Rate limiter | P1 | NOT STARTED | — | B2 |
| JWT validation middleware | P1 | NOT STARTED | — | B3 |
| Secure cookies | P1 | NOT STARTED | — | B3 |
| Input validation (Zod on backend) | P1 | NOT STARTED | — | B2 |
| .env.example (no secrets) | P1 | NOT STARTED | — | B2 |
| Secrets excluded from Git (.gitignore) | P1 | NOT STARTED | — | B1 |
| CSRF protection | BONUS | DEFERRED | — | post-deadline |
| **DEPLOYMENT** | | | | |
| Frontend on Vercel | P1 | NOT STARTED | — | B8 |
| Backend on Render | P1 | NOT STARTED | — | B8 |
| Neon PostgreSQL live | P1 | NOT STARTED | — | B8 |
| Cloudinary integration live | P1 | NOT STARTED | — | B4/B8 |
| **SUBMISSION** | | | | |
| GitHub repo + clean commit history | P1 | NOT STARTED | — | ongoing |
| README (setup, architecture, ER, API docs, deploy guide) | P1 | NOT STARTED | — | B9 |
| Prisma migrations checked in | P1 | NOT STARTED | — | B2 |
| Seed data script | P1 | NOT STARTED | — | B9 |
| .env.example | P1 | NOT STARTED | — | B2 |
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

### B2 — Completed 14:29 IST
- `npm install` succeeded: 166 packages, 0 new vulnerabilities in production deps ✅
- Prisma v8 RC discovered and downgraded to stable v5.22.0 ✅
- `prisma generate` succeeded: Prisma Client generated to node_modules ✅
- `node _test_load.js` output: `APP_LOAD_OK` ✅
- `GET http://localhost:5000/health` returned `{status:ok,service:EventHub API}` ✅
- `node_modules/` correctly gitignored (not in `git status`) ✅
- `backend/.env.example` committed, real `.env` gitignored ✅
- Commit `aafbe39` with 24 new files ✅
- 3 high severity vulnerabilities exist in dev deps (prisma toolchain) ⚠️ — not in production code path
- `AI_RULES.md` created and readable ✅
- `PROJECT_STATE.md` created and readable ✅
- `README.md` skeleton created ✅
- `.gitignore` created (covers .env, node_modules, dist, secrets) ✅
- `backend/` and `frontend/` directories exist ✅
- `git log --oneline` shows: `2cfefcc chore: initial scaffold` ✅
- Git binary located at `C:\Users\vishw\AppData\Local\Programs\Git\bin\git.exe` (not on system PATH — workaround in place) ⚠️

---

## Next Batch

**B2** — Backend foundation: `npm init` + install Express/Prisma/security packages + full Prisma schema (all 15 tables) + `.env.example` + basic server entrypoint
