from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app import models, schemas, auth
from app.database import get_db

router = APIRouter(tags=["catalogue"])

# Demo serviceable pincode list — replace with a real delivery-zone table.
SERVICEABLE_PINCODES = {"600001", "600002", "600028", "631502", "631501", "600041"}


@router.get("/categories", response_model=List[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()


@router.get("/products", response_model=List[schemas.ProductOut])
def list_products(category: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(models.Product).options(joinedload(models.Product.category)).filter(models.Product.is_active == True)  # noqa: E712
    if category:
        q = q.join(models.Category).filter(models.Category.name == category)
    return q.all()


@router.post("/products", response_model=schemas.ProductOut)
def create_product(payload: schemas.ProductCreate, db: Session = Depends(get_db), _admin=Depends(auth.require_admin)):
    product = models.Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.post("/service-area/check")
def check_pincode(payload: schemas.PincodeCheck):
    return {"pincode": payload.pincode, "serviceable": payload.pincode in SERVICEABLE_PINCODES}
