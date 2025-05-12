// 토큰 관리를 위한 유틸리티 함수

// 토큰 저장
export const setToken = (token) => {
    localStorage.setItem("auth_token", token)
  }
  
  // 토큰 가져오기
  export const getToken = () => {
    return localStorage.getItem("auth_token")
  }
  
  // 토큰 삭제 (로그아웃)
  export const removeToken = () => {
    localStorage.removeItem("auth_token")
  }
  
  // 로그인 상태 확인
  export const isAuthenticated = () => {
    return !!getToken()
  }
  