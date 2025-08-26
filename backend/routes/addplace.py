from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
from db import places_col
from db import places_temporary
from pathlib import Path # 경로 표현을 위한 라이브러리

addplace_bp = Blueprint('addplace', __name__)

@addplace_bp.route('/addplace', methods=['POST'])
@jwt_required()
def add_place():
    data = request.get_json()
    place_name = data.get("place_name")
    address = data.get("address")
    menu = data.get("menu")
    point = data.get("point")
    tags = data.get("tags")
    description = data.get("description")

    # 중복검사
    if places_col.find_one({"address" : address}):
        return jsonify(msg="중복되는 장소"), 200

    # 실제 db에 추가
    # places_col.insert_one(({"place_name" : place_name, "point" : point, "tags" : tags, "address": address, "menu" : menu, "description" : description, "comment" : []}))
    
    # 실제 db가 아닌 임시 db에 추가
    places_temporary.insert_one(({"place_name" : place_name, "point" : point, "tags" : tags, "address": address, "menu" : menu, "description" : description, "comment" : []}))

    # if places_col.find_one({"place_name": place_name}): # 디버깅
    #     print("성공")

    # seed_data는 배포한 시점에서 필요 없으므로 쓰지 않음
    # seed_data에 추가
    # .json 은 단순한 텍스트 포맷으로 인덱스 등 개념이 없다. 그래서 "파일 맨 뒤에 오브젝트 추가" 같은 것을 할 수 없다.
    # 따라서 read로 전체내용을 파이썬으로 읽어온 뒤 추가할 내용을 append 후에 write 해줘야한다.
    # new_place = {
    # "place_name": place_name,
    # "point": point,
    # "tags": tags,
    # "address": address,
    # "menu": menu,
    # "description": description,
    # "comments": []
    # }

    # # 현재 파일 위치 (my_script.py 기준)
    # current_path = Path(__file__).resolve()

    # # 상위 폴더로 한 칸 이동 (routes → backend)
    # parent_path = current_path.parents[1]

    # # 접근하려는 파일 경로
    # target_file = parent_path / 'seed_places.json'


    # with open(target_file, 'r', encoding='utf-8') as f:
    #     current_places = json.load(f)

    # current_places.append(new_place)

    # with open(target_file, 'w', encoding='utf-8') as f:
    #     json.dump(current_places, f, ensure_ascii=False, indent=2, separators=(',', ': '))

    return jsonify(msg="장소추가 성공"), 200