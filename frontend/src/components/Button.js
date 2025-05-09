"use client"

import "../styles/components/Button.css"

function Button({ text, onClick, type = "button", isLoading = false, disabled = false }) {
  return (
    <button type={type} className="auth-button" onClick={onClick} disabled={isLoading || disabled}>
      {isLoading ? "처리 중..." : text}
    </button>
  )
}

export default Button
