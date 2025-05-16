"use client"

import { useNavigate } from "react-router-dom"
import { removeToken } from "../utils/auth"
import "../styles/components/Sidebar.css"

function Sidebar({ onAddPlace }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    // 토큰 제거
    removeToken()
    // 로그인 페이지로 리다이렉트
    navigate("/login")
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">안녕하세요!</h2>
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-menu-item" onClick={onAddPlace}>
          장소 추가
        </li>
        <li className="sidebar-menu-item">코스 찾기</li>
        <li className="sidebar-menu-item">코스 만들기</li>
      </ul>
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  )
}

export default Sidebar
