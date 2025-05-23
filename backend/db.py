# MongoDB 연결
from pymongo import MongoClient
from dotenv import load_dotenv
import json
import os

# .env파일에서 설정 불러오기 by os
load_dotenv()

client = MongoClient(os.getenv('MONGODB_URI'))
db = client["feelGood"] # feelGood 이라는 이름의 데이터베이스 가져오기(없으면 생성)
users_col = db["users"] # users 이라는 이름의 컬렉션(=테이블) 가져오기(없으면 생성)
places_col = db["places"]
courses_col = db["courses"]

# seed 데이터 등록하는 함수
def insert_seed_data():
    with open("seed_places.json", "r", encoding="utf-8") as f:
        places = json.load(f)

    places_col.delete_many({})  # << 기존 데이터 싹 지우고
    for place in places:
        places_col.insert_one(place)
        # print(f"삽입: {place['place_id']}") # debug용
    
    with open("seed_course.json", "r", encoding="utf-8") as f:
        courses = json.load(f)

    courses_col.delete_many({})  # << 기존 데이터 싹 지우고
    for course in courses:
        courses_col.insert_one(course)