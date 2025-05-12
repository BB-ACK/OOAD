"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthCard from "../components/AuthCard"
import FormGroup from "../components/FormGroup"
import Button from "../components/Button"
import { loginUser } from "../utils/api"
import "../styles/routes/Login.css"
// import 부분에 auth 유틸리티 추가
import { setToken } from "../utils/auth"

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await loginUser(formData.email, formData.password)
      // handleSubmit 함수 내의 로그인 성공 부분을 다음과 같이 수정
      // 로그인 성공 시 토큰 저장
      setToken(response.access_token)
      // 홈으로 리다이렉트
      navigate("/home")
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <AuthCard title="로그인">
        <form onSubmit={handleSubmit}>
          <div className="auth-content">
            {error && <div className="error-message">{error}</div>}
            <FormGroup
              id="email"
              label="이메일"
              type="email"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleChange}
            />
            <div className="form-group">
              <div className="password-header">
                <label htmlFor="password">비밀번호</label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="auth-footer">
            <Button text="로그인" type="submit" isLoading={isLoading} />
            <div className="auth-link-text">
              계정이 없으신가요?{" "}
              <Link to="/signup" className="auth-link">
                회원가입
              </Link>
            </div>
          </div>
        </form>
      </AuthCard>
    </div>
  )
}

export default Login
