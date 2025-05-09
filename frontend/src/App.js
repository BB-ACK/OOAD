import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./routes/Login"
import Signup from "./routes/Signup"
import "./styles/common.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* 루트 경로와 모든 알 수 없는 경로를 로그인 페이지로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
