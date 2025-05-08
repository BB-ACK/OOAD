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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
