# LeaveSync Monorepo (Frontend + Backend)

Shared staff leave and Malaysian public holiday calendar. React Native (Expo) web frontend + Node.js Express + MySQL backend.

## Packages
- frontend/ — Expo (React Native Web) + Tailwind (NativeWind)
- backend/ — Express API + MySQL
- Root workspaces for unified install and scripts.

## Features
- Shared color-coded calendar (normal, connected, public holidays)
- Add leave (connected leave auto-detection)
- Public holiday caching (Calendarific API)
- Filters by staff, department, leave type, state

## Quick Start (Local with XAMPP MySQL)
1. Create database leavesync (utf8mb4).
2. Run schema: backend/schema.sql
3. Copy backend/.env.example to backend/.env and set:
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=local_dev_db2022
   MYSQL_DATABASE=leavesync
   CALENDARIFIC_API_KEY=your_key(optional)
   PORT=4000
4. Install and run:
   npm install
   npm run seed:backend
   npm run dev
   This runs backend (port 4000) and Expo web (port 8080 or 19006). Frontend auto-uses http://localhost:4000.

## Codespaces
Open with GitHub Codespaces. Devcontainer auto-starts:
- MySQL (service container)
- Seed users
- Backend + Expo web

See docs/CODESPACES.md.

## Deployment
Frontend (GitHub Pages)
- Workflow deploy.yml builds Expo web, injects backend base URL via secret FRONTEND_BACKEND_URL, and publishes to Pages.

Backend (Container Image)
- Same workflow builds and pushes Docker image to:
  ghcr.io/<OWNER>/<REPO>-backend:latest
Run it anywhere:
docker run -d -p 4000:4000 \
  -e MYSQL_HOST=your-mysql-host \
  -e MYSQL_USER=youruser \
  -e MYSQL_PASSWORD=yourpass \
  -e MYSQL_DATABASE=leavesync \
  -e CALENDARIFIC_API_KEY=your_api_key \
  ghcr.io/<OWNER>/<REPO>-backend:latest

Point Frontend to Backend
- Set the secret FRONTEND_BACKEND_URL (e.g., https://api.yourdomain.com) so the web bundle calls your API.

## Scripts
- npm run dev — concurrently run backend + frontend
- npm run seed:backend — seed users
- npm run build:frontend — build Expo web
- npm run build:backend — tsc build (if needed)
- npm run docker:backend — build backend Docker image locally

## Connected Leave Logic
Connected if day before start OR day after end is weekend (state-specific Fri–Sat vs Sat–Sun) OR public holiday.

## Roadmap
- Dashboard analytics
- Authentication
- School holidays integration
- Automated backend deploy via workflow (Render/Fly/Railway)

## Environment Variables
Backend:
- MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
- CALENDARIFIC_API_KEY (optional)
- PORT (default 4000)

Frontend:
- EXPO_PUBLIC_API_URL (injected at build; uses secret for Pages)
