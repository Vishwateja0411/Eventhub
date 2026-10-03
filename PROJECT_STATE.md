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
| B5 | Registration + capacity check + QR tickets + check-in | ✅ COMPLETE | Commit `2c178df` at 15:06 IST |

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
| QR ticket display | P1 | VERIFIED | Backend generates base64 QR; UI in B6 | B6 |
| QR scanner UI | P1 | NOT STARTED | — | B7 |
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
| Registration system | P1 | VERIFIED | Atomic registration with capacity and unique constraints | — |
| Capacity enforcement + duplicate prevention | P1 | VERIFIED | Sold-out rejection (400) + duplicate rejection (409) verified | — |
| QR ticket generation | P1 | VERIFIED | Cryptographic ticket code + high-res QR data URI PNG | — |
| QR scanning + check-in | P1 | VERIFIED | POST /api/attendance/check-in with duplicate prevention (409) | — |
| Attendance tracking | P1 | VERIFIED | GET /api/attendance/event/:id summary with turnout rate | — |
| Notifications (in-app) | P2 | VERIFIED | Automatic registration and check-in notification records | B7 UI |
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
| GitHub repo + clean commit history | P1 | NOT STARTED | 5 clean commits | ongoing |
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

### B5 — Completed 15:06 IST
- Limited-capacity event created (capacity: 2) ✅
- User 1 registered: 201 Created + Ticket with unpredictable code (`TKT-XXXXXXXX-YYYY`) + high-res base64 QR code data URI generated ✅
- Duplicate registration attempt rejected with `409 Conflict` ✅
- Ticket retrieval with QR code: `GET /api/tickets/:ticketCode` returned 200 OK ✅
- User 2 registered (fills capacity 2/2): 201 Created ✅
- User 3 registered (attempted overbooking): `400 Bad Request` ("This event is sold out. No spots available") — atomic capacity check verified ✅
- QR Scanner check-in by Organizer: `POST /api/attendance/check-in` returned 200 OK + recorded timestamp + marked attendee attended ✅
- Duplicate check-in attempt rejected with `409 Conflict` ("Duplicate Check-in Alert: Ticket was already checked in on ...") ✅
- Organizer turnout summary: `GET /api/attendance/event/:eventId` returned `turnoutRate: 50%` (1 checked in out of 2 registered) ✅
- User my-registrations list: `GET /api/registrations/my-registrations` showed `isCheckedIn: true` ✅
- Commit `2c178df` recorded with 8 files changed ✅

### B4 — Completed 15:01 IST
- `GET /api/categories` returns seeded categories with active event counts ✅
- `GET /api/events` supports pagination, city, category, isFree, and date filters ✅
- `GET /api/events/featured` returns upcoming published featured events ✅
- `POST /api/events` allows ORGANIZER to create event with unique URL slug and capacity ✅
- `GET /api/events/:slug` calculates real-time `spotsLeft` and `isSoldOut` ✅
- `PUT /api/events/:id` enables organizers to update their event details ✅
- Role enforcement: Regular `USER` attempting to create event is blocked with `403 Forbidden` ✅
- Ownership enforcement: Unauthorized user attempting to edit another organizer's event is blocked with `403 Forbidden` ✅
- Commit `6ac9320` recorded with 10 files changed ✅

### B3 — Completed 14:55 IST
- `DATABASE_URL` linked to live Neon PostgreSQL instance ✅
- Prisma schema synced with `prisma db push` — all 15 tables created in Neon ✅
- Database seeded with 4 roles, 3 test accounts, 8 categories, 2 sample events ✅
- Commit `cde11b3` recorded with 8 files changed ✅

### B2 — Completed 14:29 IST
- Express app + Prisma schema + security middleware ✅
- Commit `aafbe39` with 24 new files ✅

### B1 — Completed 14:18 IST
- Initial scaffold + Git init + `.gitignore` ✅
- Commit `2cfefcc` ✅

---

## Next Batch Proposal

### Batch B6: Frontend Architecture & Foundation + Core User Journey (Vite + React, Tailwind CSS, Dark Mode, Auth & Event Discovery)

- **Why:** The backend is fully operational with live data in Neon PostgreSQL. In this batch, we initialize the modern React + Vite frontend with Tailwind CSS, Lucide icons, React Router, TanStack Query, and Axios configured with credentials. We build the complete discovery and registration experience: responsive navigation with dark mode toggle, Hero section, Featured Events, Category browsing, Event Search & Filtering, Event Details page with interactive registration, and immediate QR Ticket modal display.
- **Files created/modified:**
  - `frontend/package.json` (Vite, React, Tailwind, Lucide React, Axios, TanStack Query, React Router DOM)
  - `frontend/vite.config.js`, `frontend/tailwind.config.js`, `frontend/postcss.config.js`
  - `frontend/src/index.css` (Tailwind directives, custom dark mode classes, smooth scroll)
  - `frontend/src/api/client.js` (Axios singleton with `withCredentials: true`, response interceptors for 401 token refresh)
  - `frontend/src/context/AuthContext.jsx` (Global auth state: user, login, register, logout, getMe check)
  - `frontend/src/context/ThemeContext.jsx` (Dark/light mode state with localStorage persistence)
  - `frontend/src/components/layout/Navbar.jsx` (Sticky glassmorphic navbar with search, auth controls, role badges, dark mode toggle)
  - `frontend/src/components/layout/Footer.jsx`
  - `frontend/src/components/events/EventCard.jsx` (Event card with spots left badge, date, pricing, category tag)
  - `frontend/src/components/events/EventFilterBar.jsx` (Category pills, city selector, search input, price toggles)
  - `frontend/src/components/tickets/TicketModal.jsx` (Modal displaying ticket details + QR code for immediate check-in)
  - `frontend/src/pages/Home.jsx` (Hero banner, category carousel, featured events, CTA)
  - `frontend/src/pages/Events.jsx` (Search, filters, grid view, pagination)
  - `frontend/src/pages/EventDetail.jsx` (Hero banner, organizer info, venue map link, 1-click register & ticket modal)
  - `frontend/src/pages/Login.jsx` & `frontend/src/pages/Register.jsx`
  - `frontend/src/App.jsx` & `frontend/src/main.jsx`
  - `PROJECT_STATE.md` (updated)
- **Actions/commands:**
  1. Initialize Vite React project in `frontend/` and install dependencies
  2. Configure Tailwind CSS and design tokens
  3. Implement API client, Auth Context, and Theme Context
  4. Build UI components and pages with premium modern aesthetics
  5. Run build test: `npm run build` inside `frontend/` to guarantee zero errors
  6. Git commit: `"feat(frontend): React + Vite setup, Tailwind CSS, Auth flow, Event discovery & QR ticket display"`
- **Acceptance checks:**
  - `npm run build` in `frontend/` succeeds with 0 errors
  - Home page loads featured events & categories dynamically from backend API
  - Search and category filter correctly filter events
  - User can register, login, view event details, register for an event, and receive their QR ticket
- **Risks/blockers:** None.
