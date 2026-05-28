"""
db_connection_test.py — BIT3208 Week 1: Database Connection Smoke Test
------------------------------------------------------------------------
Tests that Python can connect to the Smart Wholesaler database.
Supports both SQLite (no install needed) and PostgreSQL (production).

Usage:
    # SQLite (default — no setup required)
    python db_connection_test.py

    # PostgreSQL (update DB_URL below with your credentials)
    python db_connection_test.py --postgres

Requires:
    pip install sqlalchemy psycopg2-binary
"""

import sys
import time

# ── Configuration ────────────────────────────────────────────────────────────
# SQLite — stored as a file, zero configuration
SQLITE_URL = "sqlite:///./smart_wholesaler_week1_test.db"

# PostgreSQL — update these for your server
POSTGRES_URL = "postgresql://postgres:password@localhost:5432/smart_wholesaler"

# Choose which DB to test
use_postgres = "--postgres" in sys.argv
DB_URL = POSTGRES_URL if use_postgres else SQLITE_URL
DB_NAME = "PostgreSQL" if use_postgres else "SQLite"

# ── Test ─────────────────────────────────────────────────────────────────────
print("=" * 55)
print("  Smart Wholesaler — Database Connection Test")
print("  BIT3208 Week 1")
print("=" * 55)
print(f"\nTarget database : {DB_NAME}")
print(f"Connection URL  : {DB_URL}\n")

try:
    from sqlalchemy import create_engine, text

    # Step 1: Create engine
    print("[1/4] Creating SQLAlchemy engine...")
    engine = create_engine(
        DB_URL,
        connect_args={"check_same_thread": False} if "sqlite" in DB_URL else {},
    )
    print("      Engine created OK")

    # Step 2: Open connection
    print("[2/4] Opening connection...")
    start = time.time()
    with engine.connect() as conn:
        elapsed = round((time.time() - start) * 1000, 2)
        print(f"      Connected in {elapsed}ms")

        # Step 3: Run a simple query
        print("[3/4] Running test query (SELECT 1)...")
        result = conn.execute(text("SELECT 1 AS test_value"))
        row = result.fetchone()
        assert row[0] == 1, "Unexpected query result"
        print(f"      Query returned: {row[0]}  [PASS]")

        # Step 4: Check SQLite version / PostgreSQL version
        print("[4/4] Getting database version...")
        if "sqlite" in DB_URL:
            ver = conn.execute(text("SELECT sqlite_version()")).scalar()
            print(f"      SQLite version: {ver}")
        else:
            ver = conn.execute(text("SELECT version()")).scalar()
            print(f"      PostgreSQL: {ver[:60]}...")

    print()
    print("=" * 55)
    print(f"  RESULT: {DB_NAME} connection SUCCESSFUL")
    print("=" * 55)
    print()
    print("Next step (Week 5): Run backend/seed.py to create all")
    print("tables (users, products, orders, cart_items) and insert")
    print("demo data.")

except ImportError:
    print()
    print("[ERROR] SQLAlchemy is not installed.")
    print("        Run: pip install sqlalchemy psycopg2-binary")
    sys.exit(1)

except Exception as e:
    print()
    print("=" * 55)
    print(f"  RESULT: Connection FAILED")
    print("=" * 55)
    print(f"\n  Error: {e}")
    print()
    if use_postgres:
        print("Troubleshooting (PostgreSQL):")
        print("  1. Is PostgreSQL running?  pg_ctl status")
        print("  2. Does the database exist? createdb smart_wholesaler")
        print("  3. Are credentials correct in POSTGRES_URL above?")
    else:
        print("Troubleshooting (SQLite):")
        print("  1. Do you have write permission to this folder?")
        print("  2. Is SQLAlchemy installed?  pip install sqlalchemy")
    sys.exit(1)
