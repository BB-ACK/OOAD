from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from db import places_col

selectplace_bp = Blueprint('selectplace', __name__)

@selectplace_bp.route('/selectplace', methods=['POST'])
# @jwt_required
def selectplace():
    data = request.get_json()

    if not data:
        return jsonify(error="잘못된 요청 형식"), 400   # hson 요청이 아닐 시 처리.

    key = data.get("place_name")

    ret_place = list(places_col.find({"place_name": key}, {"_id": 0,"place_name": 1, "tags": 1, "address": 1, "menu": 1, "description": 1, "comment": 1})) # 원하는 필드만 포함해서 가져오기 (1은 포함, 0은 제외 의미)
    if ret_place:
        return jsonify(ret_place), 200
    
    return jsonify(msg="존재하지 않는 장소"), 400
