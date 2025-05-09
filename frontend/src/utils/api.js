const API_BASE_URL = "http://localhost:5000" // Flask 백엔드 URL에 맞게 조정하세요

export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.msg || "로그인에 실패했습니다.")
    }

    return data
  } catch (error) {
    throw error
  }
}

export async function registerUser(email, username, password, confirmPassword) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password,
        "confirm-password": confirmPassword,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.msg || "회원가입에 실패했습니다.")
    }

    return data
  } catch (error) {
    throw error
  }
}
