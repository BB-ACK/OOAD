import "../styles/components/AuthCard.css"

function AuthCard({ title, children }) {
  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default AuthCard
