<div align="center">

# University HR System

Modern HR and workforce experience platform for universities, blending admin oversight, HR processing, and employee self-service into one responsive dashboard.

</div>

## Overview

University HR System streamlines campus workforce management with persona-specific workspaces, automated workflows, and rich analytics. The app ships with a mock data layer for local development and an Express/MSSQL backend scaffold for production use.

## Feature Highlights

- **Unified authentication:** Single entry point for Admin, HR, and Employee personas with tailored routing and state management.
- **Persona dashboards:** Widget-based layouts surface attendance, leave balances, payroll history, and performance KPIs at a glance.
- **Leave & attendance workflows:** Employees initiate requests, HR reviews approvals, and admins monitor utilization trends.
- **Payroll oversight:** Snapshot cards and tables summarize compensation updates, deductions, and payout schedules.
- **HR insights:** Visualizations (charts, progress rings, mini-reports) reveal staffing mix, department alerts, and compliance reminders.
- **Reusable UI kit:** `src/components/ui` exposes composable primitives (cards, tabs, tables, charts) built with Tailwind CSS v4 and shadcn-inspired tokens.

## Architecture Overview

- **Frontend:** React + TypeScript (Vite) SPA hosted in `src/`, uses modern hooks, context, and utility helpers in `src/utils/`.
- **Mock API:** `src/utils/api.tsx` centralizes all asynchronous calls and data contracts, simulating MSSQL-backed endpoints with latency.
- **Admin Workflows:** `src/components/admin/AdminPart1.tsx` orchestrates dashboard-level API calls, request handlers, and persona routing.
- **Backend:** `backend/` hosts an Express server pre-wired for the `mssql` driver; swap the mock API with real HTTP calls when ready.
- **Styles:** Global Tailwind tokens live in `styles/globals.css`, while component-level styling is colocated with each widget.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS v4
- **State & Utilities:** React Context, custom hooks, utility helpers in `src/utils`
- **Backend:** Node.js, Express, `mssql`
- **Database:** TSQL, Microsoft SQL Server

## Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminPart1.tsx   # Admin dashboard + API wiring
│   │   │   └── AdminPart2.tsx
│   │   ├── employee/
│   │   ├── ui/                  # Shared component library
│   │   └── ...
│   ├── utils/
│   │   └── api.tsx             # Mock API + data contracts
│   ├── App.tsx
│   └── main.tsx
├── backend/
│   ├── server.js
│   ├── db.js
│   └── package.json
├── styles/
│   └── globals.css
├── package.json                # Frontend scripts/deps
└── README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- (Optional) Access to Microsoft SQL Server if running the backend against a live database

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/mariamxxxx/University-HR-System.git
cd University-HR-System
```

### 2. Launch the frontend (default experience)

```bash
npm install
npm run dev
```

Visit `http://localhost:5173/` to explore the full dashboard experience powered by the mock API.

### 3. (Optional) Boot the Express API

```bash
cd backend
npm install
node server.js
```

## Development Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | root | Start the Vite dev server |
| `npm run build` | root | Create a production build |
| `npm start` | backend | Launch the Express/MSSQL API |

## Troubleshooting

- **SQL connectivity:** Ensure SQL Browser is running or append the explicit port (e.g., `server: "localhost,1433"`) in `backend/db.js`.
- **Windows authentication:** Install `msnodesqlv8` and update the connection configuration if you prefer trusted connections.
- **Styling issues:** Confirm `src/index.css` and `styles/globals.css` are imported in `src/main.tsx`; rerun `npm run dev` after Tailwind config changes.
- **Port conflicts:** Adjust the Vite dev server via `vite.config.ts` or the Express server via the `PORT` env variable.

## Roadmap

- Connect the React app to live Express endpoints and retire the mock API.
- Document the final SQL schema and stored procedures in `/backend/database.sql`.
- Add automated tests for authentication, leave approvals, and payroll workflows.
- Introduce role-based access controls and audit logging for sensitive actions.

---

Questions or ideas? Open an issue or start a discussion in the GitHub repository.

