import random
import string
import time
from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app import models

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token", auto_error=False)

# ---------------------------------------------------------------------------
# OTP store. This is an in-memory dict for demo purposes only — swap for
# Redis (with TTL) in production, and wire send_otp() to a real SMS
# provider such as MSG91, Twilio, or Razorpay's own notification service.
# ---------------------------------------------------------------------------
_otp_store: dict[str, dict] = {}


def generate_otp(phone: str) -> str:
    otp = "".join(random.choices(string.digits, k=6))
    _otp_store[phone] = {"otp": otp, "expires": time.time() + settings.otp_expiry_seconds}
    return otp


def send_otp(phone: str, otp: str) -> None:
    # TODO: integrate real SMS gateway here.
    print(f"[DEV] OTP for {phone}: {otp}")


def verify_otp(phone: str, otp: str) -> bool:
    record = _otp_store.get(phone)
    if not record:
        return False
    if time.time() > record["expires"]:
        del _otp_store[phone]
        return False
    if record["otp"] != otp:
        return False
    del _otp_store[phone]
    return True


def create_access_token(user_id: str, role: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": user_id, "role": role, "exp": expire}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> models.User:
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exc
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exc
    except JWTError:
        raise credentials_exc

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None or not user.is_active:
        raise credentials_exc
    return user


def require_admin(user: models.User = Depends(get_current_user)) -> models.User:
    if user.role != models.UserRole.admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user
