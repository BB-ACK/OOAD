import "../styles/components/FormGroup.css"

function FormGroup({ id, label, type = "text", placeholder }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} placeholder={placeholder} className="form-input" />
    </div>
  )
}

export default FormGroup
