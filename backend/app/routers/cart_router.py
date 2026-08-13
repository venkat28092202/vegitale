from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app import models, schemas, auth
from app.database import get_db

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("", response_model=List[schemas.CartItemOut])
def get_cart(db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    return (
        db.query(models.CartItem)
        .options(joinedload(models.CartItem.product))
        .filter(models.CartItem.user_id == user.id)
        .all()
    )


@router.post("", response_model=schemas.CartItemOut)
def add_to_cart(payload: schemas.CartItemCreate, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    product = db.query(models.Product).get(payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    item = (
        db.query(models.CartItem)
        .filter(models.CartItem.user_id == user.id, models.CartItem.product_id == payload.product_id)
        .first()
    )
    if item:
        item.quantity += payload.quantity
    else:
        item = models.CartItem(user_id=user.id, product_id=payload.product_id, quantity=payload.quantity)
        db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}")
def remove_cart_item(item_id: str, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    item = db.query(models.CartItem).filter(models.CartItem.id == item_id, models.CartItem.user_id == user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    db.delete(item)
    db.commit()
    return {"message": "Removed"}
