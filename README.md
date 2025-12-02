<div align="center">

# University HR System

Web-based dashboard for university administrators, HR representatives, and employees to manage attendance, leave requests, payroll, and performance reviews.

</div>

## Features

- Unified login flows for Admin, HR, and Employee personas
- Rich dashboard widgets for leave balances, attendance summaries, and performance snapshots
- Mock API layer (`src/utils/api.tsx`) that simulates MSSQL-backed endpoints for local prototyping
- Node.js/Express backend (in `backend/`) ready to connect to a real SQL Server instance
- Component library under `src/components/ui` for consistent styling (Tailwind CSS v4)

## Tech Stack

- **Frontend:** React + TypeScript (Vite), Tailwind CSS v4
- **Backend:** Node.js, Express, `mssql` driver
- **Database (planned):** Microsoft SQL Server (currently mocked in the frontend)

## Folder Structure

```
.
├── src/                 # React application
├── backend/             # Express server + MSSQL pool
├── styles/              # Global Tailwind tokens/rules
├── package.json         # Frontend deps/scripts
└── README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- (Optional) Microsoft SQL Server + connectivity if you intend to run the backend against a real DB

## Frontend Setup

```bash
cd "c:/Users/Maria/Downloads/Admin and Employee Dashboard"
npm install
npm run dev
```

Open the Vite dev server URL (defaults to `http://localhost:5173/`). All data is currently driven by the mock API, so no backend is required for UI development.

### Environment Variables

None are required for the frontend at this stage. If you later swap the mock API for real HTTP calls, add a `.env` file with your base URL and update `src/utils/api.tsx` accordingly.

## Backend Setup

1. Install dependencies:

  ```bash
  cd "c:/Users/Maria/Downloads/Admin and Employee Dashboard/backend"
  npm install
  ```

2. Update `backend/db.js` with your SQL Server credentials or switch to Windows Authentication per your environment.

3. Start the server:

  ```bash
  npm start
  ```

4. The API runs at `http://localhost:5000/` by default and exposes an example `POST /run-procedure` endpoint that executes the `Submit_annual` stored procedure.

> **Note:** The frontend currently bypasses the backend and reads from `src/utils/api.tsx`. When you are ready to hook up real endpoints, replace the mock calls with `fetch`/`axios` requests to the Express server.

## Available Scripts

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | project root | Starts the Vite dev server |
| `npm run build` | project root | Production build of the frontend |
| `npm run lint` | project root | Applies ESLint checks (configure if needed) |
| `npm start` | `backend/` | Boots the Express server once dependencies are installed |

## Mock Data Layer

The entire mock API lives in `src/utils/api.tsx`. It includes:

- Hard-coded employees, departments, leave requests, payroll history, etc.
- Promise-based functions that simulate network latency
- Shared helpers for login, attendance, leave workflows, and HR approvals

This makes the UI fully interactive without a live database. When transitioning to the backend, follow these steps:

1. Move business logic into Express routes backed by MSSQL stored procedures.
2. Replace component imports to consume real HTTP calls instead of the mock module.
3. Remove the unused mock data to keep bundle size down.

## Troubleshooting

- **MSSQL authentication errors:** Confirm the SQL Browser service is running or use an explicit port (e.g., `server: "localhost,1433"`).
- **Windows Authentication:** Install the `msnodesqlv8` driver and adjust `db.js` if you prefer trusted connections.
- **Tailwind styling looks off:** Ensure `src/index.css` is imported in `src/main.tsx` (already configured).

## Roadmap / Next Steps

- Wire the frontend to live Express endpoints
- Expand README with DB schema/setup instructions once finalized
- Add automated tests for critical workflows

---

Feel free to adapt this README as the project evolves.
