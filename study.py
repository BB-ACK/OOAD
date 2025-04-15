from flask import Flask
from flask import request
from flask import redirect

app = Flask(__name__)

nextId = 4
topics = [
    {'id':1, 'title':'django', 'body':'strong, but hard'},
    {'id':2, 'title':'flask', 'body':'fast, but weak'},
    {'id':3, 'title':'fastapi', 'body':'fast, but not traditional'}
]

@app.route('/')
def index():
    litags = ''
    for topic in topics:
        litags = litags + f'<li>{topic["title"]}</li>'
    return f'''
    <html>
        <body>
            <ol>
                {litags}
            </ol>
            <h2>JJingBBang</h2>
        </body>
    </html>
    '''

@app.route('/read/<int:id>/')
def read(id):
    return 'your id is: ' + str(id)

@app.route('/create/', methods=['GET', 'POST'])
def create():
    litags = ''
    for topic in topics:
        litags = litags + f'<li>{topic["title"]}</li>'

    if request.method == 'GET':
        return f'''
        <html>
            <body>
                <ol>
                    {litags}
                </ol>
                <h2>JJingBBang</h2>
                <form action="/create/" method="POST">
                    <p><input type='text' name ='title' placeholder="title"></p>
                    <p><textarea name='body' placeholder="body"></textarea></p>
                    <p><input type="submit" value="create"></p>
                </form>
            </body>
        </html>
        '''
    elif request.method == 'POST':
        global nextId
        title = request.form['title']
        body = request.form['body']
        newTopic = {'id': nextId, 'title': title, 'body': body}
        topics.append(newTopic)
        url = '/read/'+str(nextId)+'/' # 만든 id 페이지로 이동. 리디렉션
        nextId = nextId + 1
        return redirect(url)


app.run(port=5000, debug=True)

# 1. 서버 열기
#port번호는 안넣으면 기본 5000이다.
#debug = True로 fastapi의 --reload 처럼 디버깅 모드로 켤 수 있다.

# 2. route
#어떤 링크로 접속했을 때 어디에 연결할지가 라우팅, 그것을 해 주는 것이 route
#path parameter는 flaks에서 <>로 감싸며, 무조건 아래 함수의 매개변수로 추가해야한다.

# 3. DB를 쓰지 않고 홈페이지 구현
#DB 연동방법 배우자.

# 4. 읽기 기능 구현
#타입힌트를 통한 자동 타입 컨버팅.
#템플릿으로 중복되는 부분 치환.

# 5. 쓰기 기능 구현
#HTML에서 제출할 때 쓰이는 태그는 <form action='/'>
#name태그는 각각이 어떤 이름이로 전달될것인가.
#url을 통해서 정보를 쓰면 GET 방식. 우리가 하려는 일이 아님.
#form태그에 method='POST'를 추가하면 POST방식으로 작동(기본이 GET)
#POST방식으로는 payload라는 곳에 정보가 숨겨진다.

#본격적으로 POST를 쓰기 위해서는 라우터에 POST 메소드를 허용해줘야한다.
#request라는 라이브러리를 추가로 import
#전역변수를 지역에서 쓸 때는 global을 써야한다.
#rediret를 위해 import를 해주고 url을 지정한다.

#UPDATE는 GET과 POST
#DELETE는 POST를 활용(GET에도 DELETE되면 안됨.)