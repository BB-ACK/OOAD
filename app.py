# app.py
from flask import Flask, render_template, redirect, request, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash

#Flask 객체 인스턴스 생성
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'supersecretkey'  # 세션 관리용 키

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"  # 로그인되지 않은 사용자는 login 페이지로 리다이렉트됨

# 사용자 모델 정의
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

# 로그인 세션 유지
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# 데이터베이스 생성
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/test')
def test():
    return render_template('test.html')

@app.route('/test2')
def test2():
    return render_template('test2.html')

# 회원가입 라우트
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # 이미 존재하는 유저인지 확인
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('이미 존재하는 계정입니다.', 'danger')
            return redirect(url_for('register'))
        
        # 비밀번호 해싱 후 저장
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

        new_user = User(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        
        flash('회원가입 완료! 로그인하세요.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

# 로그인 라우트
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password, password):
            login_user(user)
            flash('로그인 성공!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('아이디 또는 비밀번호가 틀렸습니다.', 'danger')
    
    return render_template('login.html')

# 로그아웃 라우트
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('로그아웃되었습니다.', 'info')
    return redirect(url_for('login'))

# 대시보드 (로그인한 사용자만 접근 가능)
@app.route('/dashboard')
@login_required
def dashboard():
    return f'환영합니다, {current_user.username}! <a href="/logout">로그아웃</a>'

if __name__=="__main__":
  app.run(port = 5000, debug=False)
  # host 등을 직접 지정하고 싶다면
  # app.run(host="127.0.0.1", port="5000", debug=True)


# @app.route('/', methods=('GET', 'POST')) # 접속하는 url
# def index():
#   if request.method == 'POST':
#     # user=request.form['user'] # 전달받은 name이 user인 데이터
#     # print(request.form.get('user')) # 안전하게 가져오려면 get
#     user = request.form.get('user')
#     data={'name' : "이주엽", 'level' : "build_basic"}
#     return render_template('index.html', user=user, data=data)
#   elif request.method == 'GET':
#     user = "backendManager"
#     data={'name' : "이주엽", 'level' : "build_basic"}
#     return render_template('index.html', user=user, data=data)