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
