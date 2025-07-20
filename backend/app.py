from flask import Flask
from flask_jwt_extended import JWTManager
# from dotenv import load_dotenv
import os

from flask_cors import CORS
from datetime import timedelta

from routes.user import user_bp
from routes.home import home_bp
from routes.addplace import addplace_bp
from routes.selectplace import selectplace_bp
from routes.course import course_bp
from db import insert_seed_data  # seed 함수 import

# .env파일에서 설정 불러오기 by os
## 개발환경에서만 필요.
# load_dotenv()

#Flask 객체 인스턴스 생성 및 블루프린트 설정
app = Flask(__name__)
app.register_blueprint(user_bp, url_prefix="/")
app.register_blueprint(home_bp, url_prefix="/")
app.register_blueprint(addplace_bp, url_prefix="/")
app.register_blueprint(selectplace_bp, url_prefix="/")
app.register_blueprint(course_bp, url_prefix="/")

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# # Cors : 모든 출처 허용 <------ 테스트 시에만 이렇게 하고 실제 서버 돌릴거면 고쳐야함.
# CORS(app, supports_credentials=True)

# Render 대시보드에서 REACT_APP_ORIGIN 환경 변수로 Vercel 앱의 URL을 설정해야 합니다.
# 예: Key: REACT_APP_ORIGIN, Value: https://your-react-app.vercel.app
REACT_APP_ORIGIN = os.environ.get('REACT_APP_ORIGIN')

if app.debug: # 로컬 개발 환경
    # 개발 중에는 모든 출처 허용 (디버깅 편의성 위주)
    CORS(app, supports_credentials=True)
elif REACT_APP_ORIGIN: # 프로덕션 환경에서 REACT_APP_ORIGIN이 설정된 경우
    # Vercel에 배포된 React 앱의 URL만 허용
    CORS(app, origins=REACT_APP_ORIGIN, supports_credentials=True)
else: # 프로덕션 환경인데 REACT_APP_ORIGIN이 설정 안 된 경우 (경고 또는 오류 처리)
    print("WARNING: REACT_APP_ORIGIN environment variable not set for production CORS. CORS might not work as expected or be too permissive.")
    # 보안을 위해 이 경우 차단하거나, 최소한의 기능만 허용하도록 설정
    # 예를 들어, 특정 기본 도메인만 허용하거나 아예 CORS를 켜지 않을 수도 있습니다.
    # CORS(app) # 절대 이렇게 사용하지 마세요. (supports_credentials=True와 충돌)
    # raise ValueError("REACT_APP_ORIGIN environment variable is required in production.")
    pass # 또는 적절한 오류 처리

# JWT 매니저 초기화
jwt = JWTManager(app)

# DB 초기데이터 초기화

if __name__=="__main__":
  insert_seed_data()
  app.run(port = 5000, debug=True)
  # host 등을 직접 지정하고 싶다면
  # app.run(host="127.0.0.1", port="5000", debug=True)