from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas, auth
from app.database import get_db

router = APIRouter(prefix="/addresses", tags=["addresses"])


@router.get("", response_model=List[schemas.AddressOut])
def list_addresses(db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Address).filter(models.Address.user_id == user.id).all()


@router.post("", response_model=schemas.AddressOut)
def create_address(payload: schemas.AddressCreate, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    address = models.Address(user_id=user.id, **payload.model_dump())
    db.add(address)
    db.commit()
    db.refresh(address)
    return address


@router.delete("/{address_id}")
def delete_address(address_id: str, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    address = db.query(models.Address).filter(models.Address.id == address_id, models.Address.user_id == user.id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    db.delete(address)
    db.commit()
    return {"message": "Deleted"}
