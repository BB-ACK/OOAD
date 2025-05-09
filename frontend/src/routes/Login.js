import { Link } from "react-router-dom"
import AuthCard from "../components/AuthCard"
import FormGroup from "../components/FormGroup"
import Button from "../components/Button"
import "../styles/routes/Login.css"

function Login() {
  return (
    <div className="auth-container">
      <AuthCard title="로그인">
        
        {/* 메인 입력 영역 */}
        <div className="auth-content">
          <FormGroup id="email" label="이메일" type="email" placeholder="이메일을 입력하세요" />
          <FormGroup id="password" label="비밀번호" type="password" placeholder="비밀번호를 입력하세요" />
        </div>

        {/* 버튼 및 라우터 영역 */}
        <div className="auth-footer">
          <Button text="로그인" />
          <div className="auth-link-text">
            계정이 없으신가요?{" "}
            <Link to="/signup" className="auth-link">
              회원가입
            </Link>
          </div>
        </div>
        
      </AuthCard>
    </div>
  )
}

export default Login
