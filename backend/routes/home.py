from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from db import users_col

home_bp = Blueprint('home', __name__)

@home_bp.route('/', methods=['GET'])
def home():
    return jsonify(msg=f"안녕하세요"), 200