"""
main.py — Smart Wholesaler FastAPI Application
------------------------------------------------
Run with:
    python -m uvicorn main:app --reload --port 8004

API docs: http://localhost:8004/docs
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from database import engine, Base
import models  # ensure models are registered before create_all
from routers import auth, products, cart

# ── Create all database tables on startup ────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ── FastAPI application ───────────────────────────────────────────────────────
app = FastAPI(
    title="Smart Wholesaler API",
    description="B2B wholesale supply portal backend — BIT3208 project",
    version="1.0.0",
)

# ── CORS — allow the Vite dev server ─────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3003",   # Vite dev server (current port)
        "http://localhost:5173",   # Vite default (kept as fallback)
        "http://localhost:4173",   # Vite preview
        "http://127.0.0.1:3003",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Mount routers ─────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)


# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "app": "Smart Wholesaler API", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}


# ── Logbook download ──────────────────────────────────────────────────────────
@app.get("/download/logbook", tags=["Downloads"])
def download_logbook():
    """
    Serve the BIT3208 Word logbook as a direct file download.
    The .docx file must be in the backend/ directory or one level up.
    """
    # Try backend/ dir first, then project root
    candidates = [
        os.path.join(os.path.dirname(__file__), "Smart_Wholesaler_BIT3208_Logbook.docx"),
        os.path.join(os.path.dirname(__file__), "..", "Smart_Wholesaler_BIT3208_Logbook.docx"),
    ]
    for path in candidates:
        if os.path.isfile(path):
            return FileResponse(
                path=path,
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                filename="Smart_Wholesaler_BIT3208_Logbook.docx",
            )
    return {"error": "Logbook file not found. Run generate_logbook.py first."}
