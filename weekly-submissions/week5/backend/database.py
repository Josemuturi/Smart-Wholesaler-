"""
database.py — Smart Wholesaler Database Engine
------------------------------------------------
SQLAlchemy engine and session factory for SQLite.
The database file (smart_wholesaler.db) is created automatically in the
backend/ directory on first run — no setup needed.
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite database stored as a file next to this module
DATABASE_URL = "sqlite:///./smart_wholesaler.db"

engine = create_engine(
    DATABASE_URL,
    # Required for SQLite to allow multi-threaded access (FastAPI runs async)
    connect_args={"check_same_thread": False},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all ORM models
Base = declarative_base()


def get_db():
    """
    FastAPI dependency — yields a DB session per request, always closes it after.
    Usage: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
