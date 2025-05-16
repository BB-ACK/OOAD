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
    console.error("로그인 에러:", error)
    throw error
  }
}

export async function registerUser(email, username, password, confirmPassword) {
  try {
    // 디버깅을 위한 로그 추가
    console.log("회원가입 요청 데이터:", {
      email,
      username,
      password,
      "confirm-password": confirmPassword,
    })
    console.log("요청 URL:", `${API_BASE_URL}/register`)

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

    // 응답이 JSON이 아닐 경우를 대비한 처리
    let data
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      const text = await response.text()
      console.error("JSON이 아닌 응답:", text)
      throw new Error("서버에서 예상치 못한 응답을 받았습니다.")
    }

    if (!response.ok) {
      throw new Error(data.msg || "회원가입에 실패했습니다.")
    }

    return data
  } catch (error) {
    console.error("회원가입 에러:", error)
    throw error
  }
}

// 장소 데이터 가져오기 함수 추가
export async function fetchPlaces(accessType, key = "") {
  // 토큰 가져오기
  const token = localStorage.getItem("auth_token")

  if (!token) {
    throw new Error("인증 토큰이 존재하지 않습니다. 로그인 후 이용해 주세요.")
  }

  try {
    const response = await fetch(`${API_BASE_URL}/home`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_type: accessType,
        key: key,
      }),
    })

    if (!response.ok) {
      throw new Error("장소 데이터를 가져오는데 실패했습니다.")
    }

    return await response.json()
  } catch (error) {
    console.error("장소 데이터 가져오기 오류:", error)
    throw error
  }
}

// 장소 추가 함수
export async function addPlace(placeData) {
  try {
    const response = await fetch(`${API_BASE_URL}/add_place`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(placeData),
    })

    if (!response.ok) {
      throw new Error("장소 추가에 실패했습니다.")
    }

    return await response.json()
  } catch (error) {
    console.error("장소 추가 오류:", error)
    throw error
  }
}
