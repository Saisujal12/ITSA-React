# IT Students Association KITSW — website

Full-stack website for the IT Students Association, KITSW:

- **Frontend** — React + Vite + React Router single-page app (`src/`, `public/`, `index.html`).
- **Backend** — Express API (`server/`) that writes registrations to Google
  Sheets, sends status emails through Gmail/Nodemailer and handles admin login
  with a signed, event-scoped session cookie.
- **Vercel serverless** — `api/index.js` exports the same Express app, so in
  production the site and the API are served from one origin.

```
Browser ──► /            static SPA (dist/, built by Vite)
        └─► /api/*       Express app  (Vercel: api/index.js · local: server/server.js)
                            ├─ Google Sheets  (one spreadsheet per event)
                            └─ Gmail SMTP     (registration / status emails)
```

## Running locally

```bash
npm ci
cp .env.example .env    # fill in — see "Environment variables"
```

Start the backend and the frontend in two terminals:

```bash
npm run server          # Express on PORT (default 5000); `npm run server:dev` reloads on change
npm run dev             # Vite on http://localhost:5173, proxies /api to DEV_API_PROXY_TARGET
```

The browser calls relative `/api/...` URLs. Vite's dev and preview servers
proxy `/api` to `DEV_API_PROXY_TARGET` (default `http://127.0.0.1:5000`),
which keeps the admin cookie first-party.

> **macOS:** AirPlay Receiver listens on port 5000. Either disable it, or set
> `PORT=5050` and `DEV_API_PROXY_TARGET=http://127.0.0.1:5050` in your local `.env`.

Other scripts:

```bash
npm run lint
npm run build           # production build in dist/
npm run preview         # serve the production build (also proxies /api)
```

## Environment variables

All variables are listed, without values, in `.env.example`. Locally they live
in the root `.env` (git-ignored, read by both Vite and Express); in production
they are set in the Vercel project settings. Never commit real values.

| Group | Variables |
| --- | --- |
| Frontend | `VITE_API_URL` (empty = same-origin `/api`; bundled into the browser, so never secret), `DEV_API_PROXY_TARGET` |
| Server | `PORT`, `NODE_ENV`, `FRONTEND_ORIGIN` (extra CORS origins, comma separated) |
| Admin auth | `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` |
| Google Sheets | `GOOGLE_SERVICE_ACCOUNT_JSON` *or* `GOOGLE_SERVICE_ACCOUNT_EMAIL` + `GOOGLE_PRIVATE_KEY`; `GOOGLE_SHEET_TAB_NAME`, `GOOGLE_SHEET_ID`; `EVENT_SHEET_ID_<EVENT>` |
| Email | `EMAIL_USER`, `EMAIL_APP_PASSWORD`; `EVENT_EMAIL_USER_<EVENT>`, `EVENT_EMAIL_PASSWORD_<EVENT>` |

`<EVENT>` is one of `LLM`, `CODE_BUILD`, `INNOVATION`, `CYBER_QUEST`,
`DESIGN_DEPLOY`, `TECH_CONNECT` (and `EVENT6` for sheets).

`ADMIN_PASSWORD_HASH` is an scrypt hash in `salt:key` form. Generate one
interactively (the password is typed, never stored in the repo):

```bash
node server/scripts/createAdminHash.js
```

## API

| Endpoint | Used by | Notes |
| --- | --- | --- |
| `POST /api/registrations` | Registration form | `{ eventId, event, name, collegeType, collegeName, rollNo, branch, email, phone, amount, transactionId }` → `201 { success, message, registrationId, status }`. Appends to the event's sheet and emails the student. |
| `GET /api/admin/events` | Admin login | Events an admin can sign in to. |
| `POST /api/admin/login` | Admin login | `{ username, password, eventId }` → sets the `it_admin_session` cookie, scoped to that event. |
| `GET /api/admin/check` | Admin pages | `{ authenticated, admin }`. |
| `GET /api/admin/registrations` | Admin dashboard | Registrations for the session's event: `{ registrations, event }`. |
| `PUT /api/admin/registrations/:rowNumber/status` | Verify / reject | `{ status: "VERIFIED" \| "REJECTED" }`; the event comes from the session. Emails the student. |
| `POST /api/admin/logout` | Admin dashboard | Clears the session cookie. |
| `GET /api/health` | Monitoring | Health check. |

## Deployment (Vercel)

`vercel.json` builds the frontend with `npm run build` into `dist/` and
deploys `api/index.js` as a serverless function:

- `/api/(.*)` → the Express function.
- Every other path → `index.html` (SPA fallback; existing static files are served first).
- `/assets/*` (hashed build files) are cached for a year.

Set all backend environment variables in Vercel. Leave `VITE_API_URL` empty
so the browser calls the same-origin function.

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/sumshodhini` | Sumshodhini fest |
| `/events`, `/workshops` | Events, workshops |
| `/register` | Registration (`?day=day1\|day2`, `?event=<id>&from=<day2\|events\|workshops\|day1>`) |
| `/about`, `/association` | About, association body |
| `/gallery`, `/contact` | Gallery, contact |
| `/admin` → `/admin/login`, `/admin/dashboard` | Admin |

Legacy URLs redirect to the new routes, keeping query strings and hashes:
`/index.html`, `/pages/*.html` (e.g. `/pages/register.html?event=llm` →
`/register?event=llm`), and the spellings `/samshodini`, `/sumshodini`,
`/samshodhini`, `/workshop`.

## Project structure

```
api/index.js       Vercel serverless entry (re-exports server/app.js)
server/
  app.js           Express app: helmet, CORS, JSON parsing, routes
  server.js        local entry (listens on PORT)
  routes/          registrationRoutes, adminRoutes
  controllers/     registration + admin handlers
  middleware/      requireAdmin (session cookie)
  services/        adminAuth (scrypt + signed session), emailService (Nodemailer)
  config/          googleSheets (per-event sheets), adminEvents
  scripts/         createAdminHash.js
src/
  assets/images/   brand, gallery (optimised WebP)
  components/      layout (Navbar, Footer, layouts), ui, and page-specific components
  data/            site, navigation, events, workshops, team, gallery — all content lives here
  hooks/           reveal, carousel, 3D tilt, magnetic, media queries, visibility, …
  pages/           one component + CSS Module per route (admin/ for the admin area)
  services/        api.js (fetch wrapper), registrations.js, admin.js
  styles/          tokens, reset, typography, shared primitives, motion
  utils/           asset resolver, validation, registration routing, cx
```

## Updating content

- **Events / workshops** — `src/data/events.js` is the single source for the
  events page, workshops page and registration form. Event IDs must match the
  backend (`server/config/adminEvents.js`, `registrationController.js`).
- **Registration fees** — the `fee` on each event in `src/data/events.js` is
  sent as `amount`. An event without a numeric fee cannot be registered for.
- **Team** — `src/data/team.js` (shown on the About and Association pages).
- **Previous workshops** — `src/data/workshops.js`.
- **Gallery** — `src/data/gallery.js`. Drive links set to `null` are hidden.

## Adding missing images

Images are resolved by name from `src/assets/images` (`src/utils/assets.js`).
Drop a file with the expected name (`.png`, `.jpg` or `.webp`) and it appears
automatically; until then a designed placeholder is shown.

| Folder | Expected files |
| --- | --- |
| `qr/` | `workshop-qr`, `events-qr` (payment QR codes) |
| `posters/` | `llm-poster`, `code-build-poster`, `innovation-poster`, `cyber-quest-poster`, `design-deploy-poster`, `tech-connect-poster` |
| `gallery/` | `inaugural-1`, `inaugural-2`, `sumshodini-workshop-1` … `sumshodini-workshop-6` |
| `team/` | `hod`, `faculty-coordinator-1`, `faculty-coordinator-2`, `president`, `student-coordinator`, `vice-president`, `general-secretary`, `treasurer`, `pr-media`, `technical-head` (+ `<role>-name` images), `joint-secretary-01` … `12`, `executive-member-01` … `12` |

Large photos: provide `name-800.webp` and `name-1600.webp` for a responsive
`srcset`, or a single file (used as-is).
