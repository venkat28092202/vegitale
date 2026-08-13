from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app import models, schemas, auth
from app.database import get_db

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("", response_model=List[schemas.OrderOut])
def my_orders(db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    return (
        db.query(models.Order)
        .options(joinedload(models.Order.items).joinedload(models.OrderItem.product))
        .filter(models.Order.user_id == user.id)
        .order_by(models.Order.created_at.desc())
        .all()
    )


@router.post("/checkout", response_model=schemas.OrderOut)
def checkout_cart(address_id: str, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    """Turn the current cart into a pending order awaiting payment."""
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    address = db.query(models.Address).filter(models.Address.id == address_id, models.Address.user_id == user.id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    order = models.Order(user_id=user.id, address_id=address.id, status=models.OrderStatus.pending)
    total = 0.0
    for ci in cart_items:
        line_total = ci.product.price * ci.quantity
        total += line_total
        order.items.append(models.OrderItem(product_id=ci.product_id, quantity=ci.quantity, unit_price=ci.product.price))
    order.total_amount = total

    db.add(order)
    # clear cart
    for ci in cart_items:
        db.delete(ci)
    db.commit()
    db.refresh(order)
    return order
