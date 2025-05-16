# 설명
# 장소의 위도 경도를 불러오기 위한 도구.

# 사용방법
# 위의 함수는 무시하고 아래 api_key와 address 만 바꾸면 된다
# api_key에는 kakao map api 들어 간 뒤 "앱 키" 중에서 REST_API 키를 복사해온 다음에 붙여넣기
# address는 워도와 경도를 찾기를 원하는 주소. 그냥 지도앱에서 가게찾은 다음에 뜨는 주소 그대로 입력하기.

import requests

def get_lat_lng(address, api_key):
    url = "https://dapi.kakao.com/v2/local/search/address.json"
    headers = {"Authorization": f"KakaoAK {api_key}"}
    params = {"query": address}

    response = requests.get(url, headers=headers, params=params)
    result = response.json()

    if result['documents']:
        lat = result['documents'][0]['y']
        lng = result['documents'][0]['x']
        return float(lat), float(lng)
    else:
        return None, None

# 수정할 부분
api_key = "c64f8249c2feef10fb1de37e8b261e67"
address = "서울 성북구 동소문로 106 유타빌딩"
lat, lng = get_lat_lng(address, api_key)

if lat and lng:
    print(f"\"{lat}\", \"{lng}\"")
else:
    print("주소를 찾을 수 없습니다.")