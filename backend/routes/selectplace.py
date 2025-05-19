from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from db import places_col

selectplace_bp = Blueprint('selectplace', __name__)

@selectplace_bp.route('/selectplace', methods=['POST'])
@jwt_required()
def view_place_info():
    data = request.get_json()

    if not data:
        return jsonify(error="잘못된 요청 형식"), 400   # hson 요청이 아닐 시 처리.

    key = data.get("place_name")

    ret_place = list(places_col.find({"place_name": key}, {"_id": 0,"place_name": 1, "tags": 1, "address": 1, "menu": 1, "description": 1, "comments": 1})) # 원하는 필드만 포함해서 가져오기 (1은 포함, 0은 제외 의미)
    if ret_place:
        return jsonify(ret_place), 200
    
    return jsonify(msg="존재하지 않는 장소"), 400

@selectplace_bp.route('/selectplace/comment', methods=['PUT'])
# @jwt_required()
def update_comment():
    data = request.get_json()

    if not data:
        return jsonify(error="잘못된 요청 형식"), 400   # hson 요청이 아닐 시 처리.

    key = data.get("place_name")
    new_comment = data.get("new_comment")

    # flask + pymongo의 update_one : 문서(데이터) 하나를 수정하는 함수
    # 문법 : collection.update_one(filter, update, upsert=False)
    # filter	어떤 문서를 수정할지 조건 지정 (ex. {"_id": ...})
    # update	어떤 방식으로 수정할지 명령어 지정 (ex. {"$set": {...}}, {"$push": {...}})
    # upsert	조건에 맞는 문서가 없을 경우 새로 만들지 여부 (기본값은 False)
    # update에서 우리는 리스트의 추가이므로 $push를 사용함.
    # 잠재적 문제점 : comment는 제한이 없이 늘어날 수 있음. 테이블 용량 문제 야기 -> 따로 테이블을 분리해야할 수 있음
    result = places_col.update_one({"place_name" : key}, {"$push": {"comments": new_comment}})

    if result.modified_count == 1:  # update_one으로 변경 시 modified_count는 1이 됨.
        return jsonify(new_comment), 200
    
    return jsonify(msg="잘못된 접근입니다"), 400