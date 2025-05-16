from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from db import places_col

home_bp = Blueprint('home', __name__)

@home_bp.route('/home', methods=['POST'])
@jwt_required()
def home():
    data = request.get_json()
    access_type = data.get('access_type')

    # 최초 접속 시 모든 데이터 주기
    if access_type == 'first':
        places = list(places_col.find({}, {"_id": 0,"place_name": 1, "point": 1, "tags": 1})) # 원하는 필드만 포함해서 가져오기 (1은 포함, 0은 제외 의미)
        return jsonify(places), 200

    # 검색 시 검색어를 뽑아서 DB검색에 사용
    if access_type == 'search':
        key = data.get('key')
        places = list(places_col.find({"place_name": key}, {"_id": 0,"place_name": 1, "point": 1, "tags": 1}))
        return jsonify(places), 200

    # TAG 검색 시 tag를 뽑아서 DB검색에 사용.
    if access_type == 'tag':
        key = data.get('key')
        places = list(places_col.find({"tags": key}, {"_id": 0,"place_name": 1, "point": 1, "tags": 1})) # MongDB에서는 리스트형태 필드를 단일값으로 검색 가능함.
        return jsonify(places), 200

    
# 처음에 마우스 올리면 가게명만 뜨고
# 클릭하면 상세정보. 클릭이벤트는 

# DB는 백엔드에서 검색하고 접속하고 찾고 다하고 프론트는 받은거만 띄워주면 돼
# 처음접속하면 백엔드에서 그냥 다 주는거고
# TAG나 단어 검색하면 그 결과를 백엔드가 찾아서 
# 너가 꺼낸다기 보다는 내가 전체를 준다면 거기에서 조건문으로 필터링은 할 수 있겠지.
# 내가 그 KAKAO MAP API 마커 띄우는데 필요한 정보들(워도 경도 포함)을 다 줄거야.
# 프론트에서는 DB 접근을 안하는게 원리적으로 맞는거같아

# 상세정보도 아예 넘기고 클릭 때 보여주게만 하게 하면 요청 횟수는 줄일 수 있지

# 일단 필수적인 요청은 최초접속시/명령어검색시/TAG버튼클릭시 3가지고
# 여기에 클릭때마다 상세정보 요청하게 할 수도 있고 아니면 위 3가지에서 미리 준다음에 너가 저장했다가 쓰면 요청은 위 3가지로만 충분한거고.
# 아니지. 지도 마커에서 필요한 정보가위도경도가게명 이정도에
# 필수정보랑 상세정보에 뭘 얼마나 넣냐에 따라 달라/
# 좋아요를 마우스를 올리기만 해도 보여줄지 아니면 클릭해야 보여줄지 등등..

# 1. access_type
# 최초 접속이면 ‘first’, 검색일 시 ‘search, tag검색시 ‘tag’

# 2. key
# 최초 접속 시 공백, 검색시 검색어, tag시 tag명
