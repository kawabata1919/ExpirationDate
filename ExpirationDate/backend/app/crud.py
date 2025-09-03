from sqlalchemy.orm import Session
from . import models, schemas

def get_foods(db: Session):
    return db.query(models.Food).all()

def create_food(db: Session, food: schemas.FoodCreate, image_path: str = None):
    db_food = models.Food(
        name=food.name,
        expiry_date=food.expiry_date,
        image_path=image_path
    )
    db.add(db_food)
    db.commit()
    db.refresh(db_food)
    return db_food

def delete_food(db: Session, food_id: int):
    food = db.query(models.Food).filter(models.Food.id == food_id).first()
    if food:
        db.delete(food)
        db.commit()
        return True
    return False
