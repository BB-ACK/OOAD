from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from db import places_col, courses_col

course_bp = Blueprint('course', __name__)

@course_bp.route('/course', methods=['POST'])
# @jwt_required()
def course_page():
    data = request.get_json()
    access_type = data.get("access_type")
    key = data.get('key')

    # 최초 접속시 course list(course_name 들)를 넘겨 줌.
    if access_type == "first":
        course_list = list(courses_col.find({}, {"_id" : 0, "course_name" : 1}))
        return jsonify(course_list)
    
    # 프론트에서 넘긴 key를 토대로 course정보(course_info) 및 course에 포함된 장소들의 좌표정보(points)를 넘김.
    course_info = courses_col.find_one({"course_name" : key}, {"_id": 0, "course_name": 1,  "place_list": 1, "description": 1, "cost": 1}) # 원하는 필드만 포함해서 가져오기 (1은 포함, 0은 제외 의미)
    place_list = course_info.get("place_list", [])
    # MongoDB 연산 $in : MongoDB에서 특정 필드가 주어진 리스트 내의 값 중 하나와 일치하는 문서를 찾고 싶을 때 사용
    raw_points = list(places_col.find({"place_name" : {"$in": place_list}}, {"_id" : 0, "point" : 1}))

    # 변환: ["37.592", "127.01"] → {"lat": 37.592, "lng": 127.01}
    converted_points = []
    for item in raw_points:
        point = item.get("point", [])
        if len(point) == 2:
            lat, lng = map(float, point)
            converted_points.append({"lat": lat, "lng": lng})

    return jsonify({
        "course_info": course_info,
        "points": converted_points
    }), 200

@course_bp.route('/course', methods=['POST'])
@jwt_required()
def add_course():
    data = request.get_json()
    new_course_name = data.get("course_name")
    place_list = data.get("place_list")
    description = data.get("description")
    cost = data.get("cost")

    # 중복검사
    if courses_col.find_one({"course_name" : new_course_name}):
        return jsonify(msg="중복되는 코스명"), 200

    # 실제 DB에 추가
    courses_col.insert_one({"course_name": new_course_name, "place_list": place_list, "description": description, "cost": cost})

@course_bp.route('/course', methods=['POST'])
@jwt_required()
def rand_course_maker():
    return