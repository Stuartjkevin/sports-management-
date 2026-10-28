# Sport Team Management Portal

**Multi-Sport Team Management and Performance Analytics System** (BTech CSE project)

## Phase 1 — Frontend foundation (current)

React frontend only, using mock data. No backend, database or real authentication yet.

| Tool | Version |
| --- | --- |
| Node.js | 22 LTS or newer |
| React / React DOM | 19.1.0 |
| Vite | 6.3.5 (`@vitejs/plugin-react` 4.4.1) |
| React Router DOM | 7.6.0 |
| Bootstrap | 5.3.6 |
| Bootstrap Icons | 1.13.1 |
| Chart.js / react-chartjs-2 | 4.4.9 / 5.3.0 |

## Run it

```powershell
cd sport-team-portal\frontend
npm install
npm run dev
```

Open http://localhost:5173

## Demo login

Any valid email plus a password of 6 or more characters works. Pick a role (Super Admin, Club Admin, Coach, Player).
After login, use the **DEMO ROLE** dropdown in the top bar to switch roles.

> The demo AuthContext, role switcher and ProtectedRoute are **temporary**.
> They will be replaced with JWT authentication in the backend phase.

## Folder guide

```
frontend/src/
  components/  reusable UI (cards, tables, badges, forms, route guard)
  layouts/     PublicLayout, DashboardLayout (sidebar + top bar)
  pages/       one file per page
  data/        mock data - replace with API calls later
  context/     AuthContext (demo), NotificationContext
  hooks/       useAuth, useForm, useCrudList, useFakeLoading, useNotifications
  utils/       roles & permissions, validators, formatting, chart setup, team selection logic
  styles/      global.css
```

## Phase 2 — Backend API (current)

Express 5 REST API with JWT login and role checks. Data is stored **in memory** for now
(resets on restart); MongoDB Atlas will replace it later via `backend/src/repositories/index.js`.

| Package | Version |
| --- | --- |
| express | 5.1.0 |
| jsonwebtoken | 9.0.2 |
| bcryptjs | 3.0.2 |
| cors / helmet / dotenv | 2.8.5 / 8.1.0 / 16.5.0 |

```powershell
cd sport-team-portal\backend
npm install
npm run dev      # API on http://localhost:5000
npm run smoke    # in a second terminal: runs the API checks
```

Demo accounts (password `Demo@123`): superadmin@stp.demo, clubadmin@stp.demo, coach@stp.demo, player@stp.demo.
Copy `backend/.env.example` to `backend/.env` and set a long random `JWT_SECRET`.

### Endpoints (all under /api)

| Method | Path | Roles |
| --- | --- | --- |
| GET | /health | public |
| POST | /auth/register, /auth/login | public |
| GET / PUT | /auth/me, PUT /auth/me/password | logged in |
| CRUD | /clubs | read: staff · write: Super Admin |
| CRUD | /teams, GET /teams/:id/players | read: all · write: Super/Club Admin |
| CRUD | /players, GET /players/me | read/write: staff · /me: Player |
| CRUD | /matches (?sport ?teamId ?status) | read: all · write: staff |
| CRUD | /tournaments, GET /tournaments/:id/standings | read: all · write: Super/Club Admin |
| CRUD | /training, GET/PUT /training/:id/attendance | staff |
| GET, PATCH, DELETE | /notifications, /notifications/read-all, /notifications/:id/read | own notifications |
| GET | /analytics/overview, /analytics/sport/:sport | staff |
| POST | /team-selection | staff |

"Staff" = Super Admin, Club Admin, Coach. CRUD = GET /, GET /:id, POST /, PUT|PATCH /:id, DELETE /:id.

## Phase 3 — Frontend connected to the API

The React app now loads all data from the API and logs in with real JWT tokens.
Mock data files and the demo role switcher were removed.

- `frontend/.env` → `VITE_API_URL=http://localhost:5000/api`
- `frontend/src/services/` → `apiClient.js` (fetch + token + errors), `authService.js`, `resourceServices.js`
- `frontend/src/hooks/useApi.js` → loading / error / reload for any API call
- Server validation errors appear under the matching form field

Run both (two terminals, from the top folder): `npm run dev:backend` and `npm run dev`.

## Roadmap

1. Phase 1 — Frontend with mock data ✅
2. Phase 2 — Express.js API with JWT auth (in-memory data) ✅
3. Phase 3 — Connect the React frontend to the API ✅
4. Phase 4 — MongoDB Atlas + Mongoose
5. Later — Basketball and Volleyball
