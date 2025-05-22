import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./routes/Login"
import Signup from "./routes/Signup"
import Home from "./routes/Home"
import Course from "./routes/Course"
import "./styles/common.css"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/course" element={<Course />} />
        {/* 루트 경로는 인증 상태에 따라 홈 또는 로그인으로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
