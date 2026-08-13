from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app import models, schemas, auth
from app.database import get_db

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/customers", response_model=List[schemas.UserOut])
def list_customers(db: Session = Depends(get_db), _admin=Depends(auth.require_admin)):
    return db.query(models.User).filter(models.User.role == models.UserRole.customer).all()


@router.get("/subscriptions", response_model=List[schemas.SubscriptionOut])
def list_all_subscriptions(db: Session = Depends(get_db), _admin=Depends(auth.require_admin)):
    return (
        db.query(models.Subscription)
        .options(joinedload(models.Subscription.plan), joinedload(models.Subscription.address))
        .all()
    )


@router.get("/orders", response_model=List[schemas.OrderOut])
def list_all_orders(status: str | None = None, db: Session = Depends(get_db), _admin=Depends(auth.require_admin)):
    q = db.query(models.Order).options(joinedload(models.Order.items).joinedload(models.OrderItem.product))
    if status:
        q = q.filter(models.Order.status == status)
    return q.order_by(models.Order.created_at.desc()).all()


@router.post("/orders/{order_id}/status")
def update_order_status(order_id: str, status: str, db: Session = Depends(get_db), _admin=Depends(auth.require_admin)):
    order = db.query(models.Order).get(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    try:
        order.status = models.OrderStatus(status)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status value")
    db.commit()
    return {"message": "Order status updated", "status": order.status}


@router.get("/deliveries/today")
def deliveries_today(db: Session = Depends(get_db), _admin=Depends(auth.require_admin)):
    """List of orders scheduled for delivery today, for route planning /
    export into a tool like Routific or Circuit."""
    orders = (
        db.query(models.Order)
        .options(joinedload(models.Order.address), joinedload(models.Order.user))
        .filter(models.Order.status.in_([models.OrderStatus.packed, models.OrderStatus.out_for_delivery]))
        .all()
    )
    return [
        {
            "order_id": o.id,
            "customer": o.user.name,
            "phone": o.user.phone,
            "address": f"{o.address.line1}, {o.address.city} {o.address.pincode}",
            "status": o.status,
        }
        for o in orders
    ]


@router.post("/deliveries/{order_id}/status")
def update_delivery_status(order_id: str, status: str, db: Session = Depends(get_db), _admin=Depends(auth.require_admin)):
    delivery = db.query(models.Delivery).filter(models.Delivery.order_id == order_id).first()
    if not delivery:
        delivery = models.Delivery(order_id=order_id)
        db.add(delivery)
    try:
        delivery.status = models.DeliveryStatus(status)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status value")
    db.commit()
    return {"message": "Delivery status updated", "status": delivery.status}
