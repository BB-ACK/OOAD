"use client"

import "../styles/components/FormGroup.css"

function FormGroup({ id, label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="form-input"
        value={value || ""}
        onChange={onChange}
        name={id}
      />
    </div>
  )
}

export default FormGroup
