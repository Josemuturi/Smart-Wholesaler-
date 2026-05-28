# Week 1 — Vite + React Environment Setup

## What This Week Covers
- Installing Node.js, Python 3.12, Git, VS Code
- Bootstrapping the project with Vite + React
- Creating the Hello World landing page
- Testing the PostgreSQL/SQLite database connection

## How to Run

```bash
npm install
npm run dev
```

App runs at: http://localhost:5173

## Database Connection Test

```bash
pip install psycopg2-binary sqlalchemy
python db_connection_test.py
```

## Folder Structure (Week 1)

```
week1/
├── index.html              ← Vite HTML shell
├── package.json            ← Dependencies manifest
├── vite.config.js          ← Vite build config
├── src/
│   ├── main.jsx            ← React DOM mount
│   └── App.jsx             ← Hello World component
└── db_connection_test.py   ← DB connection smoke test
```

## GitHub Commit Message for This Week
```
feat(week1): scaffold Vite+React project, Hello World page, DB connection test
```
