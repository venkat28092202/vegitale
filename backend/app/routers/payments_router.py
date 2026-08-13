import hashlib
import hmac

import razorpay
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app import models, schemas, auth
from app.config import settings
from app.database import get_db

router = APIRouter(prefix="/payments", tags=["payments"])


def _client() -> razorpay.Client:
    if not settings.razorpay_key_id or not settings.razorpay_key_secret:
        raise HTTPException(status_code=500, detail="Razorpay keys are not configured on the server")
    client = razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))
    return client


@router.post("/create-order")
def create_payment_order(payload: schemas.CreatePaymentOrder, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    order = db.query(models.Order).filter(models.Order.id == payload.order_id, models.Order.user_id == user.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    client = _client()
    rp_order = client.order.create({
        "amount": int(order.total_amount * 100),  # paise
        "currency": "INR",
        "receipt": order.id,
        "payment_capture": 1,
    })

    payment = models.Payment(
        order_id=order.id,
        razorpay_order_id=rp_order["id"],
        amount=order.total_amount,
        status=models.PaymentStatus.created,
    )
    db.add(payment)
    db.commit()

    return {
        "razorpay_order_id": rp_order["id"],
        "amount": rp_order["amount"],
        "currency": rp_order["currency"],
        "key_id": settings.razorpay_key_id,
    }


@router.post("/verify")
def verify_payment(payload: schemas.RazorpayVerify, db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    order = db.query(models.Order).filter(models.Order.id == payload.order_id, models.Order.user_id == user.id).first()
    if not order or not order.payment:
        raise HTTPException(status_code=404, detail="Order/payment not found")

    generated_signature = hmac.new(
        key=settings.razorpay_key_secret.encode(),
        msg=f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}".encode(),
        digestmod=hashlib.sha256,
    ).hexdigest()

    if generated_signature != payload.razorpay_signature:
        order.payment.status = models.PaymentStatus.failed
        db.commit()
        raise HTTPException(status_code=400, detail="Payment verification failed")

    order.payment.status = models.PaymentStatus.paid
    order.payment.razorpay_payment_id = payload.razorpay_payment_id
    order.payment.razorpay_signature = payload.razorpay_signature
    order.status = models.OrderStatus.locked
    db.commit()
    return {"message": "Payment verified"}


@router.post("/webhook")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    """Handles async events from Razorpay, e.g. recurring-charge failures for
    dunning management (auto-retry on failed subscription renewals)."""
    body = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")

    expected = hmac.new(
        key=settings.razorpay_webhook_secret.encode(),
        msg=body,
        digestmod=hashlib.sha256,
    ).hexdigest()
    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    payload = await request.json()
    event = payload.get("event")

    if event == "payment.failed":
        rp_order_id = payload["payload"]["payment"]["entity"].get("order_id")
        payment = db.query(models.Payment).filter(models.Payment.razorpay_order_id == rp_order_id).first()
        if payment:
            payment.status = models.PaymentStatus.failed
            payment.retry_count += 1
            db.commit()

    return {"received": True}
