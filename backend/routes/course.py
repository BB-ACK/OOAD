from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from db import places_col, courses_col
import json
from pathlib import Path # 경로 표현을 위한 라이브러리

course_bp = Blueprint('course', __name__)

@course_bp.route('/course', methods=['POST'])
@jwt_required()
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
    # MongoDB 연산 $in을 사용하면 장소db에서 위에있는 순으로 위도, 경도를 찾는데, 이러면 프론트에서 표시할 때 순서가 중요한데, 망가짐.
    # 대신 반복문으로 하나하나 찾기.
    raw_info = []
    for place in place_list:
        raw_info.append(places_col.find_one({"place_name" : place}, {"_id" : 0, "point" : 1, "description": 1}))

    converted_points = [] # response에 포함 될 장소들의 좌표정보
    desc = []               # response에 포함 될 장소들의 설명 정보
    for item in raw_info:
        point = item.get("point", [])
        lat, lng = map(float, point)
        converted_points.append({"lat": lat, "lng": lng}) # 변환: ["37.592", "127.01"] → {"lat": 37.592, "lng": 127.01}
        
        i = item.get("description")
        desc.append(i)

    return jsonify({
        "course_info": course_info,
        "points": converted_points,
        "place_desc": desc
    }), 200


@course_bp.route('/addcourse', methods=['POST'])
@jwt_required()
def add_course():
    data = request.get_json()
    new_course_name = data.get("course_name")
    place_list = data.get("place_list")
    description = data.get("description")
    cost = data.get("cost")

    # 코스명 중복검사
    if courses_col.find_one({"course_name" : new_course_name}):
        return jsonify(msg="중복되는 코스명"), 400
    
    # 장소명 유무 검사
    found_places = list(places_col.find({"place_name": {"$in": place_list}}, {"_id": 0, "place_name": 1}))

    # DB에 존재하는 장소 수
    found_place_names = [place["place_name"] for place in found_places]
    missing_places = list(set(place_list) - set(found_place_names))

    if missing_places:
        return jsonify({
            "missing_places": missing_places
        }), 400  # 클라이언트 잘못으로 간주하여 400 Bad Request

    # 실제 DB에 추가
    courses_col.insert_one({"course_name": new_course_name, "place_list": place_list, "description": description, "cost": cost})

    # seed에 추가
    new_course = {
        "course_name" : new_course_name,
        "place_list" : place_list,
        "description" : description,
        "cost" : cost
    }

    current_path = Path(__file__).resolve() # 현재 파일 위치
    parent_path = current_path.parents[1] # 상위 폴더로 한 칸 이동 (routes → backend)
    target_file = parent_path / 'seed_course.json' # 접근하려는 파일 경로

    with open(target_file, 'r', encoding='utf-8') as f:
        current_courses = json.load(f)

    current_courses.append(new_course)

    with open(target_file, 'w', encoding='utf-8') as f:
        json.dump(current_courses, f, ensure_ascii=False, indent=2, separators=(',', ': '))

    return jsonify(msg="코스추가 성공"), 200

@course_bp.route('/course', methods=['POST'])
@jwt_required()
def rand_course_maker():
    return