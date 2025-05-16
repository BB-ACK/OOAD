import requests
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from db import places_col

addplace_bp = Blueprint('addplace', __name__)

# # 위도 경도 계산기.
# def get_lat_lng(address, api_key = "c64f8249c2feef10fb1de37e8b261e67"):
#     url = "https://dapi.kakao.com/v2/local/search/address.json"
#     headers = {"Authorization": f"KakaoAK {api_key}"}
#     params = {"query": address}

#     response = requests.get(url, headers=headers, params=params)
#     result = response.json()

#     if result['documents']:
#         lat = result['documents'][0]['y']
#         lng = result['documents'][0]['x']
#         return float(lat), float(lng)
#     else:
#         return None, None

@addplace_bp.route('/addplace', methods=['POST'])
@jwt_required()
def add():
    data = request.get_json()
    place_name = data.get("place_name")
    address = data.get("address")
    menu = data.get("menu")
    point = data.get("point")
    tags = data.get("tags")
    description = data.get("description")
    
    places_col.insert_one(({"place_name" : place_name, "point" : point, "tags" : tags, "address": address, "menu" : menu, "description" : description, "comment" : ""}))
    
    return jsonify("장소추가 성공"), 200