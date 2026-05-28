# Week 3 — Form Validation, Password Toggle & API Utility

## What This Week Covers
- Adding JavaScript form validation to the Login page
- Implementing password show/hide toggle
- Building the centralised API utility (api.js) for backend communication
- Connecting the Login form to the API layer

## How to Run

```bash
# From the project root
npm install
npm run dev
```

## Folder Structure (Week 3)

```
week3/
├── README.md
├── src/
│   ├── utils/
│   │   └── api.js           ← Fetch wrapper with JWT Bearer header injection
│   └── pages/
│       ├── Login.jsx        ← Full React login with validation + password toggle
│       └── Login.css        ← Login-specific styles
```

## Key JavaScript Concepts Introduced
| Feature | Implementation |
|---|---|
| Form validation | if (!email \|\| !password) setError(...) |
| Password toggle | useState(false) + input type switching |
| API call | async/await + fetch via api.post() |
| Error display | Conditional JSX + role="alert" |

## GitHub Commit Message for This Week
```
feat(week3): form validation, password toggle, api.js utility layer
```
