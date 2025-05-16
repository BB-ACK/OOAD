from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

from flask_cors import CORS
from datetime import timedelta

from routes.user import user_bp
from routes.home import home_bp
from routes.addplace import addplace_bp
from db import insert_seed_data  # seed 함수 import

# .env파일에서 설정 불러오기 by os
load_dotenv()

#Flask 객체 인스턴스 생성 및 블루프린트 설정
app = Flask(__name__)
app.register_blueprint(user_bp, url_prefix="/")
app.register_blueprint(home_bp, url_prefix="/")
app.register_blueprint(addplace_bp, url_prefix="/")

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# Cors : 모든 출처 허용 <------ 테스트 시에만 이렇게 하고 실제 서버 돌릴거면 고쳐야함.
CORS(app, supports_credentials=True)

# JWT 매니저 초기화
jwt = JWTManager(app)

# DB 초기데이터 초기화

if __name__=="__main__":
  insert_seed_data()
  app.run(port = 5000, debug=True)
  # host 등을 직접 지정하고 싶다면
  # app.run(host="127.0.0.1", port="5000", debug=True)