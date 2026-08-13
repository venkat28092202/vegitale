"""Run once to populate categories, products, subscription plans, and an
admin user for local development.

    python seed.py
"""
from app.database import SessionLocal, Base, engine
from app import models

Base.metadata.create_all(bind=engine)

db = SessionLocal()

CATEGORIES = ["Vegetables", "Fruits", "Greens", "Combo boxes"]
PRODUCTS = [
    ("Tomato", "Vegetables", "1 kg", 40),
    ("Carrot", "Vegetables", "1 kg", 50),
    ("Beetroot", "Vegetables", "500 g", 35),
    ("Spinach", "Greens", "250 g", 30),
    ("Coriander bunch", "Greens", "1 bunch", 15),
    ("Banana", "Fruits", "1 dozen", 60),
    ("Papaya", "Fruits", "1 pc", 45),
    ("Family Combo Box", "Combo boxes", "8 kg mixed", 449),
]
PLANS = [
    ("Basic", "6 everyday vegetables for a small household.", 499, 4.5),
    ("Family", "Our most popular box — built for 3-4 people.", 899, 8.5),
    ("Premium", "Organic-first selection with rare & exotic picks.", 1399, 11.0),
]

try:
    cat_map = {}
    for name in CATEGORIES:
        existing = db.query(models.Category).filter_by(name=name).first()
        if not existing:
            existing = models.Category(name=name)
            db.add(existing)
            db.commit()
            db.refresh(existing)
        cat_map[name] = existing

    for name, cat, unit, price in PRODUCTS:
        if not db.query(models.Product).filter_by(name=name).first():
            db.add(models.Product(name=name, category_id=cat_map[cat].id, unit=unit, price=price, stock_qty=100))
    db.commit()

    for name, desc, price, weight in PLANS:
        if not db.query(models.SubscriptionPlan).filter_by(name=name).first():
            db.add(models.SubscriptionPlan(name=name, description=desc, price=price, weight_kg=weight))
    db.commit()

    if not db.query(models.User).filter_by(phone="9999999999").first():
        db.add(models.User(name="Admin", phone="9999999999", role=models.UserRole.admin))
        db.commit()

    print("Seed complete.")
finally:
    db.close()
