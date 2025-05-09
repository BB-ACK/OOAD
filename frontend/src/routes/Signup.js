import { Link } from "react-router-dom"
import AuthCard from "../components/AuthCard"
import FormGroup from "../components/FormGroup"
import Button from "../components/Button"
import "../styles/routes/Signup.css"

function Signup() {
  return (
    <div className="auth-container">
      <AuthCard title="회원가입">

        {/* 이름 아이디 비밀번호 메인 콘텐츠 영역 */}
        <div className="auth-content">
          <FormGroup id="username" label="이름" placeholder="이름을 입력하세요" />
          <FormGroup id="email" label="이메일" type="email" placeholder="이메일을 입력하세요" />
          <FormGroup id="password" label="비밀번호" type="password" placeholder="비밀번호를 입력하세요" />
          <FormGroup id="confirm-password" label="비밀번호 확인" type="password"placeholder="비밀번호를 다시 입력하세요"/>
        </div>

        {/* 버튼(submit) 및 링크 영역 */}
        <div className="auth-footer">
          <Button text="회원가입" />
          <div className="auth-link-text">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="auth-link">
              로그인
            </Link>
          </div>
        </div>
        
      </AuthCard>
    </div>
  )
}

export default Signup
