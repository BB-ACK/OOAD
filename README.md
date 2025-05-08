# 파일구조 설명
1. app.py : 서버
2. templates 폴더 : html파일들을 모아놓음.
3. static 폴더 : css, js파일 등 정적파일을 모아놓음
4. instance 폴더 : db파일 넣어놓은 폴더. 현재 쓰고있는 sqlite의 경우 .db 파일로 데이터베이스를 관리할 수 있음.
4-1. users.db : 회원정보를 모아놓은 db.

# html css / flask 연동 정보
- 정적 파일을 참조할 때
{{ url_for('static', filename='정적파일') }} 식으로 작성합니다.
예 : {{ url_for('static', filename='css/style.css') }}

- jinja2 엔진으로 작성
flask는 jinja2 템플릿 엔진을 사용합니다.
변수를 가져오는 템플릿은 {{변수명}} 입니다.
key로 value를 가져올 땐 {{변수명.key}}입니다.

Test push

# 파일구조 설명
backend 폴더에는 flask 및 db(mongodb), frotend 폴더에는 react 파일을 배치한다.

## backend 폴더 by backEndManager
- app.py : 서버 실행파일
- db.py : 데이터베이스 관리 파일
- .env : 보안되어야 하는 환경변수 모음. JWT 시크릿키 등.
- routes/ : flaks 라우트 모음.

## frontend 폴더 by frontEndManager
react에 관한 폴더.

# 로컬에서 실행해보기
## 1. 가상환경 실행 및 필요한 라이브러리 설치
프로젝트 폴더에서 아래 명령어를 cmd창에 입력한다.

    python -m venv venv # 가상환경 생성
    venv\Scripts\activate   # 가상환경 활성화(windows 기준)
    pip install -r requirements.txt # (가상환경에) 패키지 설치

위 과정을 통해 가상환경 및 패키지 설치가 끝난다.

## 2. 프로젝트 실행.
정리 중..

