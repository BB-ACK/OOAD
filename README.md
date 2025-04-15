# 파일 설명
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

# 웹 사이트 접속하기 
Railway를 활용하여 로컬이 아니여도 접속이 가능하도록 하였다.
ooad-production.up.railway.app를 통해서 접속이 가능하며
현재 로그인, 회원가입및 추가적으로 /test, /test2 URL에 덧 붙여 지도 기능을 확인할 수 있다.
