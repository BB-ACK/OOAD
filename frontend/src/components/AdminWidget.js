"use client"

import { useNavigate } from "react-router-dom"
import "../styles/components/AdminWidget.css"

function AdminWidget() {
  const navigate = useNavigate()

  const handleAdminClick = () => {
    navigate("/admin")
  }

  return (
    <div className="admin-widget">
      <button className="admin-button" onClick={handleAdminClick} title="관리자 모드">
        <span className="admin-icon">⚙️</span>
        <span className="admin-text">관리자</span>
      </button>
    </div>
  )
}

export default AdminWidget
