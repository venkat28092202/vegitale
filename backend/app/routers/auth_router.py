from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas, auth
from app.database import get_db

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/otp/request")
def request_otp(payload: schemas.OTPRequest):
    otp = auth.generate_otp(payload.phone)
    auth.send_otp(payload.phone, otp)
    return {"message": "OTP sent"}


@router.post("/otp/verify", response_model=schemas.Token)
def verify_otp(payload: schemas.OTPVerify, db: Session = Depends(get_db)):
    if not auth.verify_otp(payload.phone, payload.otp):
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")

    user = db.query(models.User).filter(models.User.phone == payload.phone).first()
    if not user:
        user = models.User(name=payload.name or "New customer", phone=payload.phone)
        db.add(user)
        db.commit()
        db.refresh(user)

    token = auth.create_access_token(user.id, user.role.value)
    return schemas.Token(access_token=token)


@router.get("/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
