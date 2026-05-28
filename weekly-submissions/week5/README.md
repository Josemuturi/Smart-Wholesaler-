# Week 5 — FastAPI Backend, JWT Authentication & PostgreSQL Schema

## What This Week Covers
- Building the complete REST API using FastAPI and Uvicorn
- Implementing JWT (JSON Web Tokens) token-based authentication and Bcrypt password hashing
- Writing ORM models (User, Product, Cart, Order) using SQLAlchemy and SQLite (local dev database)
- Defining the production PostgreSQL schema (`schema.sql`) with seed data for distributors and retailers
- Building API routers for Auth, Products, and Cart CRUD operations

## Folder Structure (Week 5)

```
week5/
├── README.md
├── schema.sql                     ← PostgreSQL production database schema
└── backend/                       ← FastAPI application source code
    ├── main.py                    ← Application entry point & configuration
    ├── auth.py                    ← JWT and password security helpers
    ├── database.py                ← DB connection and session setup
    ├── models.py                  ← SQLAlchemy database models
    ├── schemas.py                 ← Pydantic validation schemas
    ├── seed.py                    ← SQLite database seeder
    ├── requirements.txt           ← Backend dependencies list
    └── routers/                   ← API endpoint routers
        ├── auth.py
        ├── products.py
        └── cart.py
```

## Running the Backend locally
```bash
cd backend
pip install -r requirements.txt
python seed.py
python -m uvicorn main:app --reload --port 8004
```

## GitHub Commit Message for This Week
```
Week 5: FastAPI backend, SQLite database, JWT auth, PostgreSQL schema
```
