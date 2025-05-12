"use client"

import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { isAuthenticated } from "../utils/auth"
import "../styles/routes/Home.css"

function Home() {
  const navigate = useNavigate()
  const mapContainer = useRef(null)
  const map = useRef(null)

  // 인증 상태 확인 및 카카오맵 초기화
  useEffect(() => {
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!isAuthenticated()) {
      navigate("/login")
      return
    }

    // 카카오맵 스크립트 로드
    const script = document.createElement("script")
    script.async = true
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=be61e42cdca795d909362701b6eb5fb4&autoload=false"
    document.head.appendChild(script)

    script.onload = () => {
      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
          level: 3,
        }
        map.current = new window.kakao.maps.Map(mapContainer.current, options)
      })
    }

    return () => {
      // 스크립트 제거
      document.head.removeChild(script)
    }
  }, [navigate])

  return (
    <>
      <Sidebar />
      <div className="home-container">
        <div className="home-header">
          <h1 className="home-title">Feel Good</h1>
        </div>
        <div className="map-container" ref={mapContainer}></div>
      </div>
    </>
  )
}

export default Home
