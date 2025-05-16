from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from db import places_col

addplace_bp = Blueprint('addplace', __name__)

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

    
    places_col.insert_one(({"place_name" : place_name, "point" : point, "tags" : tags, "address": address, "menu" : menu, "description" : description, "comment" : []}))
    
    # if places_col.find_one({"place_name": place_name}): # 디버깅
    #     print("성공")

    return jsonify("장소추가 성공"), 200