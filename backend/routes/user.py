from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from db import users_col

user_bp = Blueprint('user', __name__)

# 회원가입
@user_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")
    passwordCheck = data.get("confirm-password")

    if password != passwordCheck:
        return jsonify(msg="비밀번호 확인이 틀립니다"), 400

    if users_col.find_one({"email": email}):
        return jsonify(msg="이미 존재하는 이메일입니다"), 400
    
    hashed_pw = generate_password_hash(password)
    users_col.insert_one({"email" : email, "username": username, "password": hashed_pw})
    return jsonify(msg="회원가입 성공"), 201

# 로그인 라우트
@user_bp.route('/login', methods=['GET', 'POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = users_col.find_one({"email": email})

    if user and check_password_hash(user["password"], password):
        token = create_access_token(identity=email)  # token 발급
        return jsonify(access_token=token), 200       # token response
    
    return jsonify(msg="이메일 또는 비밀번호가 틀립니다"), 401

# 보호된 라우트 <-------------- @jwt_required() 추가.
@user_bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(msg=f"안녕하세요, {current_user}님"), 200

# # 로그아웃 라우트
# @app.route('/logout')
# @login_required
# def logout():
#     logout_user()
#     flash('로그아웃되었습니다.', 'info')
#     return redirect(url_for('login'))