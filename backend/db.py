# MongoDB 연결
from pymongo import MongoClient
from dotenv import load_dotenv
import json
import os

# seed 데이터 등록하는 함수
def insert_seed_data():
    with open("seed_food.json", "r", encoding="utf-8") as f:
        foods = json.load(f)

    for food in foods:
        if not foods_col.find_one({"place_id": food["place_id"]}):
            foods_col.insert_one(food)

# .env파일에서 설정 불러오기 by os
load_dotenv()

client = MongoClient(os.getenv('MONGODB_URI'))
db = client["feelGood"] # feelGood 이라는 이름의 데이터베이스 가져오기(없으면 생성)
users_col = db["users"] # users 이라는 이름의 컬렉션(=테이블) 가져오기(없으면 생성)
foods_col = db["foods"] 


