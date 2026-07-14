from fastapi import FastAPI

from app.routes import router
from app.settings import Settings

settings = Settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)

app.include_router(router)