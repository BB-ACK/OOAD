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

# FrontEnd README
# 로컬에서 실행

리액트를 사용하기 위해 Node.js가 필요
https://nodejs.org/ko 을 통해서 node.js 설치

    node -v  # Node.js 버전 확인
    npm -v   # npm 버전 확인
    npm install react-router-dom # 추가적으로 라우터 설치
    npm start # 실행할 디렉토리 위치에서 실행

# 파일 구조 설명

src에서 파일 다루기에 src 확인하면 된다

## src/App.js

가장 메인으로 실행하는 파일이라고 생각하면 좋을듯 
굳이 여기서 페이지를 만들지 않고 routes에다가 구현 후 url경로와 해당 파일을 연결시켜주고 가장 처음 페이지를 설정

## src/index.js

브라우저에 렌더링 하는 역할
App을 컴포넌트로 주어서 처음 시작화면을 App을 렌더링 하게된다

## src/components

각 기능을 수행하는 컴포넌트들

## src/routes

url에서 /login 등등 하면 갈 수 있는 실질적 페이지 구조라고 생각

## src/styles

css파일들 모음

시발련아