"use client"

import { useNavigate } from "react-router-dom"
import { removeToken } from "../utils/auth"
import "../styles/components/CourseSidebar.css"

function CourseSidebar({ courses, onCourseSelect }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    // 토큰 제거
    removeToken()
    // 로그인 페이지로 리다이렉트
    navigate("/login")
  }

  const handleHomeClick = () => {
    navigate("/home")
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">코스 추천</h2>
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-menu-item" onClick={handleHomeClick}>
          홈으로 돌아가기
        </li>
        <li className="sidebar-menu-divider"></li>
        <li className="sidebar-menu-label">추천 코스</li>
        {courses && courses.length > 0 ? (
          courses.map((course, index) => (
            <li
              key={index}
              className="sidebar-menu-item course-item"
              onClick={() => onCourseSelect(course.course_name)}
            >
              {course.course_name}
            </li>
          ))
        ) : (
          <li className="sidebar-menu-item no-courses">코스가 없습니다</li>
        )}
      </ul>
      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </div>
  )
}

export default CourseSidebar
