from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.config import settings
from app.routers import (
    auth_router,
    products_router,
    cart_router,
    addresses_router,
    subscriptions_router,
    orders_router,
    payments_router,
    admin_router,
)

# Create tables (use Alembic migrations for production instead of this).
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Vegitale API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(products_router.router)
app.include_router(cart_router.router)
app.include_router(addresses_router.router)
app.include_router(subscriptions_router.router)
app.include_router(orders_router.router)
app.include_router(payments_router.router)
app.include_router(admin_router.router)


@app.get("/")
def root():
    return {"service": "Vegitale API", "status": "ok"}


@app.get("/health")
def health():
    return {"status": "healthy"}
