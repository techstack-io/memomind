from fastapi import FastAPI

from settings import Settings

settings = Settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)

@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Hello from Memologic"}

@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}