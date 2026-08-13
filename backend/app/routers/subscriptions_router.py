from datetime import datetime, timedelta
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app import models, schemas, auth
from app.database import get_db

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


@router.get("/plans", response_model=List[schemas.PlanOut])
def list_plans(db: Session = Depends(get_db)):
    return db.query(models.SubscriptionPlan).filter(models.SubscriptionPlan.is_active == True).all()  # noqa: E712


@router.get("", response_model=List[schemas.SubscriptionOut])
def my_subscriptions(db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    return (
        db.query(models.Subscription)
        .options(joinedload(models.Subscription.plan), joinedload(models.Subscription.address))
        .filter(models.Subscription.user_id == user.id)
        .all()
    )


def _next_delivery_date(delivery_day: str) -> datetime:
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    today = datetime.utcnow()
    target = days.index(delivery_day) if delivery_day in days else 3  # default Thursday
    delta = (target - today.weekday()) % 7
    delta = delta or 7
    return today + timedelta(days=delta)


@router.post("", response_model=schemas.SubscriptionOut)
def create_subscription(payload: schemas.SubscriptionCreate, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    plan = db.query(models.SubscriptionPlan).get(payload.plan_id)
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    address = db.query(models.Address).filter(models.Address.id == payload.address_id, models.Address.user_id == user.id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    sub = models.Subscription(
        user_id=user.id,
        plan_id=plan.id,
        address_id=address.id,
        frequency=payload.frequency,
        delivery_day=payload.delivery_day,
        next_delivery_date=_next_delivery_date(payload.delivery_day),
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub


@router.post("/{subscription_id}/pause")
def pause_subscription(subscription_id: str, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    sub = _get_owned_subscription(db, subscription_id, user)
    sub.status = models.SubscriptionStatus.paused
    db.commit()
    return {"message": "Subscription paused"}


@router.post("/{subscription_id}/resume")
def resume_subscription(subscription_id: str, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    sub = _get_owned_subscription(db, subscription_id, user)
    sub.status = models.SubscriptionStatus.active
    db.commit()
    return {"message": "Subscription resumed"}


@router.post("/{subscription_id}/cancel")
def cancel_subscription(subscription_id: str, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    sub = _get_owned_subscription(db, subscription_id, user)
    sub.status = models.SubscriptionStatus.cancelled
    db.commit()
    return {"message": "Subscription cancelled"}


@router.post("/{subscription_id}/skip-next")
def skip_next_delivery(subscription_id: str, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    sub = _get_owned_subscription(db, subscription_id, user)
    if sub.next_delivery_date:
        sub.next_delivery_date += timedelta(days=7 if sub.frequency == "weekly" else 14)
    db.commit()
    return {"message": "Next delivery skipped", "next_delivery_date": sub.next_delivery_date}


def _get_owned_subscription(db: Session, subscription_id: str, user: models.User) -> models.Subscription:
    sub = db.query(models.Subscription).filter(models.Subscription.id == subscription_id, models.Subscription.user_id == user.id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")
    return sub
