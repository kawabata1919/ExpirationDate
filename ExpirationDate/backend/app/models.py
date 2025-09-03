from sqlalchemy import Column, Integer, String, Date
from .database import Base

class Food(Base):
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    expiry_date = Column(Date)
    image_path = Column(String, nullable=True)
