"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthCard from "../components/AuthCard"
import FormGroup from "../components/FormGroup"
import Button from "../components/Button"
import { registerUser } from "../utils/api"
import "../styles/routes/Signup.css"

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    "confirm-password": "",
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

    // 비밀번호 일치 확인
    if (formData.password !== formData["confirm-password"]) {
      setError("비밀번호 확인이 틀립니다")
      return
    }

    setIsLoading(true)

    try {
      await registerUser(
        formData.email,
        formData.name, // 이름을 username으로 사용
        formData.password,
        formData["confirm-password"],
      )

      // 회원가입 성공, 로그인 페이지로 리다이렉트
      alert("회원가입 성공! 로그인 페이지로 이동합니다.")
      navigate("/login", { state: { message: "회원가입 성공! 로그인해주세요." } })
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <AuthCard title="회원가입">
        <form onSubmit={handleSubmit}>
          <div className="auth-content">
            {error && <div className="error-message">{error}</div>}
            <FormGroup
              id="name"
              label="이름"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={handleChange}
            />
            <FormGroup
              id="email"
              label="이메일"
              type="email"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleChange}
            />
            <FormGroup
              id="password"
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
            />
            <FormGroup
              id="confirm-password"
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData["confirm-password"]}
              onChange={handleChange}
            />
          </div>
          <div className="auth-footer">
            <Button text="회원가입" type="submit" isLoading={isLoading} />
            <div className="auth-link-text">
              이미 계정이 있으신가요?{" "}
              <Link to="/login" className="auth-link">
                로그인
              </Link>
            </div>
          </div>
        </form>
      </AuthCard>
    </div>
  )
}

export default Signup
