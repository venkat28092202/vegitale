from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, ConfigDict


# ---------- Auth ----------
class OTPRequest(BaseModel):
    phone: str


class OTPVerify(BaseModel):
    phone: str
    otp: str
    name: Optional[str] = None  # used on first-time signup


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    phone: str
    email: Optional[str] = None
    role: str


# ---------- Address ----------
class AddressCreate(BaseModel):
    label: str = "Home"
    line1: str
    line2: Optional[str] = None
    city: str
    state: str
    pincode: str
    is_default: bool = False


class AddressOut(AddressCreate):
    model_config = ConfigDict(from_attributes=True)
    id: str


# ---------- Catalogue ----------
class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    description: Optional[str] = None
    unit: str
    price: float
    image_url: Optional[str] = None
    stock_qty: int
    category: CategoryOut


class ProductCreate(BaseModel):
    category_id: str
    name: str
    description: Optional[str] = None
    unit: str
    price: float
    image_url: Optional[str] = None
    stock_qty: int = 0


# ---------- Cart ----------
class CartItemCreate(BaseModel):
    product_id: str
    quantity: int = 1


class CartItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    quantity: int
    product: ProductOut


# ---------- Subscription plans ----------
class PlanOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    description: Optional[str] = None
    price: float
    weight_kg: float


class SubscriptionCreate(BaseModel):
    plan_id: str
    address_id: str
    frequency: str = "weekly"
    delivery_day: str = "Thursday"


class SubscriptionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    frequency: str
    delivery_day: str
    status: str
    next_delivery_date: Optional[datetime] = None
    plan: PlanOut
    address: AddressOut


# ---------- Orders ----------
class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    quantity: int
    unit_price: float
    product: ProductOut


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    status: str
    total_amount: float
    scheduled_delivery_date: Optional[datetime] = None
    created_at: datetime
    items: List[OrderItemOut] = []


# ---------- Payments ----------
class CreatePaymentOrder(BaseModel):
    order_id: str


class RazorpayVerify(BaseModel):
    order_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


# ---------- Pincode check ----------
class PincodeCheck(BaseModel):
    pincode: str
