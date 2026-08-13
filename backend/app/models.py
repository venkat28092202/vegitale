import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Enum, Text
)
from sqlalchemy.orm import relationship

from app.database import Base


def gen_uuid():
    return str(uuid.uuid4())


class UserRole(str, enum.Enum):
    customer = "customer"
    admin = "admin"
    delivery = "delivery"


class SubscriptionStatus(str, enum.Enum):
    active = "active"
    paused = "paused"
    cancelled = "cancelled"


class OrderStatus(str, enum.Enum):
    pending = "pending"
    locked = "locked"
    packed = "packed"
    out_for_delivery = "out_for_delivery"
    delivered = "delivered"
    skipped = "skipped"
    cancelled = "cancelled"


class PaymentStatus(str, enum.Enum):
    created = "created"
    paid = "paid"
    failed = "failed"
    refunded = "refunded"


class DeliveryStatus(str, enum.Enum):
    pending = "pending"
    packed = "packed"
    out_for_delivery = "out_for_delivery"
    delivered = "delivered"
    failed = "failed"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False, index=True)
    email = Column(String, unique=True, nullable=True)
    password_hash = Column(String, nullable=True)  # optional if OTP-only login
    role = Column(Enum(UserRole), default=UserRole.customer, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    addresses = relationship("Address", back_populates="user", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")


class Address(Base):
    __tablename__ = "addresses"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    label = Column(String, default="Home")  # Home / Work / Other
    line1 = Column(String, nullable=False)
    line2 = Column(String, nullable=True)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    pincode = Column(String, nullable=False, index=True)
    is_default = Column(Boolean, default=False)

    user = relationship("User", back_populates="addresses")


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, unique=True, nullable=False)  # Vegetables / Fruits / Greens / Combo boxes

    products = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=gen_uuid)
    category_id = Column(String, ForeignKey("categories.id"), nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    unit = Column(String, nullable=False)  # "1 kg", "1 bunch", etc.
    price = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)
    stock_qty = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    category = relationship("Category", back_populates="products")


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)

    user = relationship("User", back_populates="cart_items")
    product = relationship("Product")


class SubscriptionPlan(Base):
    """Static plan catalogue: Basic / Family / Premium."""
    __tablename__ = "subscription_plans"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=False)  # Basic / Family / Premium
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    weight_kg = Column(Float, nullable=False)
    is_active = Column(Boolean, default=True)


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    plan_id = Column(String, ForeignKey("subscription_plans.id"), nullable=False)
    address_id = Column(String, ForeignKey("addresses.id"), nullable=False)
    frequency = Column(String, default="weekly")  # weekly / biweekly / monthly
    delivery_day = Column(String, default="Thursday")
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.active)
    razorpay_subscription_id = Column(String, nullable=True)
    next_delivery_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="subscriptions")
    plan = relationship("SubscriptionPlan")
    address = relationship("Address")
    items = relationship("SubscriptionItem", back_populates="subscription", cascade="all, delete-orphan")


class SubscriptionItem(Base):
    """Customer's customisation / swap preferences for their recurring box."""
    __tablename__ = "subscription_items"

    id = Column(String, primary_key=True, default=gen_uuid)
    subscription_id = Column(String, ForeignKey("subscriptions.id"), nullable=False)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)
    excluded = Column(Boolean, default=False)  # "No onions" style exclusion

    subscription = relationship("Subscription", back_populates="items")
    product = relationship("Product")


class Order(Base):
    """One recurring cycle's generated order, or a one-off cart order."""
    __tablename__ = "orders"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    subscription_id = Column(String, ForeignKey("subscriptions.id"), nullable=True)
    address_id = Column(String, ForeignKey("addresses.id"), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.pending)
    total_amount = Column(Float, default=0)
    cutoff_at = Column(DateTime, nullable=True)
    scheduled_delivery_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="orders")
    subscription = relationship("Subscription")
    address = relationship("Address")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payment = relationship("Payment", back_populates="order", uselist=False)
    delivery = relationship("Delivery", back_populates="order", uselist=False)


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, default=gen_uuid)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    product_id = Column(String, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, default=1)
    unit_price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(String, primary_key=True, default=gen_uuid)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False, unique=True)
    razorpay_order_id = Column(String, nullable=True)
    razorpay_payment_id = Column(String, nullable=True)
    razorpay_signature = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.created)
    retry_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    order = relationship("Order", back_populates="payment")


class Delivery(Base):
    __tablename__ = "deliveries"

    id = Column(String, primary_key=True, default=gen_uuid)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False, unique=True)
    status = Column(Enum(DeliveryStatus), default=DeliveryStatus.pending)
    driver_name = Column(String, nullable=True)
    driver_phone = Column(String, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    notes = Column(String, nullable=True)

    order = relationship("Order", back_populates="delivery")
