# Docker Buster Tickets

**All tickets must include or update tests as appropriate.**

## 1. TODO Items [CURRENT PRIORITIES]

1.1 [ ] **Restore Core Functionality Post-UI Rebuild [HIGHEST PRIORITY]**
  - ...

1.2 [ ] **Verify Core Feature Functionality [HIGH PRIORITY]**
  - ...

---

### NEW: [BUG] Frontend/Backend API URL Mismatch Causes "Failed to fetch"
- **Summary:** When running frontend (Next.js) and backend (FastAPI) locally, API requests from the frontend to the backend fail with `Error: Failed to fetch` if the API URL uses `127.0.0.1` and the frontend is accessed via `localhost` (or vice versa).
- **Steps to Reproduce:**
  1. Start backend at `http://127.0.0.1:8000`.
  2. Start frontend at `http://localhost:3000`.
  3. Attempt a scan from the UI.
  4. Observe network error and no backend log activity.
- **Root Cause:** Browsers treat `localhost` and `127.0.0.1` as different origins, causing CORS/network failures.
- **Workaround:** Set `NEXT_PUBLIC_API_URL` in the frontend to match the hostname used to access the frontend (e.g., both `localhost`).
- **Fix:**
  - Update `.env.local` in frontend: `NEXT_PUBLIC_API_URL=http://localhost:8000`
  - Restart frontend dev server after change.
  - Confirmed fix: API requests now succeed; backend logs show successful /report requests.
- **Status:** Fixed in dev, .env.local updated, tested OK

---

## 2. Enhanced Report Format [PRIORITY]
...
