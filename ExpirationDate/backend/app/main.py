from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, crud
from .database import SessionLocal, engine, Base
import shutil
import os
from datetime import datetime
from pathlib import Path

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS設定（Reactからのアクセス許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:5173",
        "https://192.168.0.170:5173"
    ],  # 本番は適切に制限
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory="app/images"), name="images")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 食材一覧取得
@app.get("/foods", response_model=list[schemas.Food])
def read_foods(db: Session = Depends(get_db)):
    return crud.get_foods(db)

# 食材追加（画像アップロード対応）
@app.post("/foods", response_model=schemas.Food)
async def create_food(
    name: str = Form(...),
    expiry_date: str = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_path = None
    if file:
        images_dir = Path("app/images")
        os.makedirs(images_dir, exist_ok=True)
        filename = f"{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}"
        file_path = images_dir / filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        image_path = f"images/{filename}"  # 相対パスを保存
    food_create = schemas.FoodCreate(name=name, expiry_date=expiry_date)
    return crud.create_food(db, food_create, image_path)

# 食材削除
@app.delete("/foods/{food_id}")
def delete_food(food_id: int, db: Session = Depends(get_db)):
    result = crud.delete_food(db, food_id)
    if not result:
        raise HTTPException(status_code=404, detail="Food not found")
    return {"ok": True}
