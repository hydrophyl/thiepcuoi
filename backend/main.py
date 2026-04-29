from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator, model_validator
import sqlite3
from typing import Optional
from datetime import datetime

app = FastAPI(title="Wedding API")

# Update with your frontend's real URL in production
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def init_db():
    conn = sqlite3.connect("wedding.db")
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS visits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            guest_name TEXT,
            visit_time TEXT
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS rsvps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            attendance TEXT,
            guests INTEGER,
            city TEXT,
            confirm_by TEXT,
            submitted_time TEXT
        )
    ''')
    # Migrate existing DB: add confirm_by column if missing
    try:
        c.execute("ALTER TABLE rsvps ADD COLUMN confirm_by TEXT")
    except sqlite3.OperationalError:
        pass  # column already exists
    conn.commit()
    conn.close()

init_db()

VALID_ATTENDANCE = {"yes", "no", "maybe"}
VALID_CITIES = {"Ho Chi Minh", "Hanoi", "Both"}

class VisitData(BaseModel):
    guest: Optional[str] = None
    time: str

class RSVPData(BaseModel):
    name: str
    guests: int
    city: str
    attendance: str
    confirmBy: Optional[str] = None

    @field_validator("name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name cannot be empty")
        if len(v) > 100:
            raise ValueError("Name is too long (max 100 characters)")
        return v

    @field_validator("attendance")
    @classmethod
    def valid_attendance(cls, v: str) -> str:
        if v not in VALID_ATTENDANCE:
            raise ValueError(f"attendance must be one of {VALID_ATTENDANCE}")
        return v

    @field_validator("city")
    @classmethod
    def valid_city(cls, v: str) -> str:
        if v not in VALID_CITIES:
            raise ValueError(f"city must be one of {VALID_CITIES}")
        return v

    @field_validator("guests")
    @classmethod
    def valid_guests(cls, v: int) -> int:
        if v < 1 or v > 20:
            raise ValueError("guests must be between 1 and 20")
        return v

    @model_validator(mode="after")
    def confirm_by_required_for_maybe(self) -> "RSVPData":
        if self.attendance == "maybe" and not self.confirmBy:
            raise ValueError("confirmBy date is required when attendance is 'maybe'")
        return self


@app.post("/track-visit")
def track_visit(data: VisitData):
    conn = sqlite3.connect("wedding.db")
    c = conn.cursor()
    c.execute("INSERT INTO visits (guest_name, visit_time) VALUES (?, ?)", (data.guest, data.time))
    conn.commit()
    conn.close()
    return {"status": "success"}

@app.post("/rsvp")
def rsvp(data: RSVPData):
    conn = sqlite3.connect("wedding.db")
    c = conn.cursor()
    c.execute(
        "INSERT INTO rsvps (name, attendance, guests, city, confirm_by, submitted_time) VALUES (?, ?, ?, ?, ?, ?)",
        (data.name, data.attendance, data.guests, data.city, data.confirmBy, datetime.now().isoformat())
    )
    conn.commit()
    conn.close()
    return {"status": "success"}

@app.get("/guests")
def get_guests():
    """Return confirmed guest list with summary statistics."""
    conn = sqlite3.connect("wedding.db")
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    rows = c.execute(
        "SELECT name, attendance, guests, city, confirm_by, submitted_time FROM rsvps ORDER BY submitted_time DESC"
    ).fetchall()
    conn.close()

    guest_list = [dict(r) for r in rows]

    confirmed = [g for g in guest_list if g["attendance"] == "yes"]
    maybe     = [g for g in guest_list if g["attendance"] == "maybe"]
    declined  = [g for g in guest_list if g["attendance"] == "no"]

    def count_by_city(subset):
        result = {}
        for g in subset:
            city = g["city"]
            result[city] = result.get(city, 0) + g["guests"]
        return result

    summary = {
        "total_responses": len(guest_list),
        "confirmed": {
            "count": len(confirmed),
            "total_guests": sum(g["guests"] for g in confirmed),
            "by_city": count_by_city(confirmed),
        },
        "maybe": {
            "count": len(maybe),
            "total_guests": sum(g["guests"] for g in maybe),
            "by_city": count_by_city(maybe),
        },
        "declined": {
            "count": len(declined),
        },
    }

    return {"summary": summary, "guests": guest_list}

@app.get("/insights")
def get_insights():
    """Retrieve all logged insights (visits and RSVPs)"""
    conn = sqlite3.connect("wedding.db")
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    visits = [dict(row) for row in c.execute("SELECT * FROM visits").fetchall()]
    rsvps  = [dict(row) for row in c.execute("SELECT * FROM rsvps").fetchall()]
    conn.close()

    return {"visits": visits, "rsvps": rsvps}
