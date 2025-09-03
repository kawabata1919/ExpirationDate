from pydantic import BaseModel
from datetime import date
from typing import Optional

class FoodBase(BaseModel):
    name: str
    expiry_date: date

class FoodCreate(FoodBase):
    pass

class Food(FoodBase):
    id: int
    image_path: Optional[str]

    class Config:
        from_attributes = True
