from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import places_col, places_temporary

# 임시 db의 장소들을 보여주는 페이지.

admin_bp = Blueprint('admin', __name__)

TARGET_USER_ID = "admin"

@admin_bp.route('/admin', methods=['POST'])
@jwt_required()
def admin():
    current_user_id = get_jwt_identity()

    if current_user_id != TARGET_USER_ID:
        return 403

    data = request.get_json()
    access_type = data.get('access_type')

    # 최초 접속 시 모든 데이터 주기
    if access_type == 'first':
        places = list(places_temporary.find({}, {"_id": 0,"place_name": 1, "point": 1, "tags": 1})) # 원하는 필드만 포함해서 가져오기 (1은 포함, 0은 제외 의미)
        return jsonify(places), 200
    
    if access_type == "yes":
        key = data.get('key') # 장소명을 key로 받음
        document_to_copy = places_temporary.find_one({"place_name": key})
        document_to_copy.pop('_id', None)
        places_col.insert_one(document_to_copy)

        places = list(places_temporary.find({}, {"_id": 0,"place_name": 1, "point": 1, "tags": 1})) # 원하는 필드만 포함해서 가져오기 (1은 포함, 0은 제외 의미)
        return jsonify(places), 200

    if access_type == "no":
        key = data.get('key')
        places_temporary.delete_one({"place_name": key}) # 임시 db에서 삭제하기
    
        places = list(places_temporary.find({}, {"_id": 0,"place_name": 1, "point": 1, "tags": 1})) # 원하는 필드만 포함해서 가져오기 (1은 포함, 0은 제외 의미)
        return jsonify(places), 200

    # # 검색 시 검색어를 뽑아서 DB검색에 사용
    # if access_type == 'search':
    #     key = data.get('key')
    #     places = list(places_temporary.find({"place_name": key}, {"_id": 0,"place_name": 1, "point": 1, "tags": 1}))
    #     return jsonify(places), 200

    # # TAG 검색 시 tag를 뽑아서 DB검색에 사용.
    # if access_type == 'tag':
    #     key = data.get('key')
    #     places = list(places_temporary.find({"tags": key}, {"_id": 0,"place_name": 1, "point": 1, "tags": 1})) # MongDB에서는 리스트형태 필드를 단일값으로 검색 가능함.
    #     return jsonify(places), 200