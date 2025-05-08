"use client"

import "../styles/components/Button.css"

function Button({ text, onClick, type = "button" }) {
  return (
    <button type={type} className="auth-button" onClick={onClick}>
      {text}
    </button>
  )
}

export default Button
