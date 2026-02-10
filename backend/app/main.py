from dotenv import load_dotenv

# Load env vars before any tradingagents imports (they read env at import time)
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.analysis import router as analysis_router
from app.routes.profile import router as profile_router

app = FastAPI(title="TradingAgents API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis_router)
app.include_router(profile_router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
