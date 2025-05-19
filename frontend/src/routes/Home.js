"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import AddPlaceModal from "../components/AddPlaceModal"
import PlaceDetailModal from "../components/PlaceDetailModal"
import { isAuthenticated } from "../utils/auth"
import { fetchPlaces, selectplace } from "../utils/api"
import { restaurantMarkerUrl } from "../assets/marker-restaurant"
import { cafeMarkerUrl } from "../assets/marker-cafe"
import { entertainmentMarkerUrl } from "../assets/marker-entertainment"
import "../styles/routes/Home.css"

function Home() {
  const navigate = useNavigate()
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [places, setPlaces] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const markers = useRef([])
  const infowindows = useRef([])
  const [isAddPlaceModalOpen, setIsAddPlaceModalOpen] = useState(false) // Declare the variable here
  const [isPlaceDetailModalOpen, setIsPlaceDetailModalOpen] = useState(false)
  const [selectedPlaceInfo, setSelectedPlaceInfo] = useState(null)

  // 카테고리 목록
  const categories = [
    { id: "음식점", name: "#맛집", color: "#FF6B6B" },
    { id: "카페", name: "#카페", color: "#4A90E2" },
    { id: "놀거리", name: "#놀거리", color: "#8E44AD" },
    // 음식점 세부 카테고리
    { id: "한식", name: "#한식", color: "#FF8A80" },
    { id: "중식", name: "#중식", color: "#FF8A80" },
    { id: "일식", name: "#일식", color: "#FF8A80" },
    { id: "양식", name: "#양식", color: "#FF8A80" },
    { id: "분식", name: "#분식", color: "#FF8A80" },
    { id: "패스트푸드", name: "#패스트푸드", color: "#FF8A80" },
    { id: "드링크", name: "#드링크", color: "#FF8A80" },
    // 카페 세부 카테고리
    { id: "디저트", name: "#디저트", color: "#82B1FF" },
    { id: "베이커리", name: "#베이커리", color: "#82B1FF" },
    { id: "커피", name: "#커피", color: "#82B1FF" },
    { id: "차", name: "#차", color: "#82B1FF" },
    // 놀거리 세부 카테고리
    { id: "영화", name: "#영화", color: "#B39DDB" },
    { id: "쇼핑", name: "#쇼핑", color: "#B39DDB" },
    { id: "게임", name: "#게임", color: "#B39DDB" },
    { id: "공원", name: "#공원", color: "#B39DDB" },
    { id: "전시회", name: "#전시회", color: "#B39DDB" },
    { id: "액티비티", name: "#액티비티", color: "#B39DDB" },

    { id: "기타", name: "#기타", color: "#B39DDB" },

  ]

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
          center: new window.kakao.maps.LatLng(37.5865, 127.009), // 성신여대 근처 좌표로 수정
          level: 4,
        }
        map.current = new window.kakao.maps.Map(mapContainer.current, options)

        // 지도 로드 후 음식점 데이터 가져오기
        loadPlaces("first", "")
      })
    }

    return () => {
      // 스크립트 제거
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [navigate])

  // 음식점 데이터 가져오기
  const loadPlaces = async (accessType, key) => {
    try {
      const data = await fetchPlaces(accessType, key)
      setPlaces(data)

      // 데이터를 받아온 후 마커 표시
      if (map.current) {
        displayMarkers(data)
      }
    } catch (error) {
      console.error("음식점 데이터 가져오기 오류:", error)
    }
  }

  // 검색 처리 함수
  const handleSearch = (e) => {
    e.preventDefault()
    setSelectedCategory("") // 카테고리 선택 초기화
    if (searchTerm.trim()) {
      loadPlaces("search", searchTerm.trim())
    } else {
      // 검색어가 비어있으면 모든 장소 표시
      loadPlaces("first", "")
    }
  }

  // 검색어 변경 처리 함수
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    // 검색어가 비어있으면 모든 장소 표시
    if (e.target.value === "") {
      setSelectedCategory("") // 카테고리 선택 초기화
      loadPlaces("first", "")
    }
  }

  // 카테고리 필터링 함수
  const handleCategoryFilter = (category) => {
    setSearchTerm("") // 검색어 초기화

    if (selectedCategory === category) {
      // 이미 선택된 카테고리를 다시 클릭하면 필터 해제
      setSelectedCategory("")
      loadPlaces("first", "")
    } else {
      // 새 카테고리 선택
      setSelectedCategory(category)
      loadPlaces("tag", category)
    }
  }

  // 마커 표시 함수
  const displayMarkers = (places) => {
    // 기존 마커와 인포윈도우 제거
    markers.current.forEach((marker) => marker.setMap(null))
    infowindows.current.forEach((infowindow) => infowindow.close())

    markers.current = []
    infowindows.current = []

    places.forEach((place) => {
      const position = new window.kakao.maps.LatLng(place.point[0], place.point[1])

      // 카테고리에 따른 마커 이미지 설정
      let markerImageUrl = restaurantMarkerUrl // 기본값은 음식점 마커

      if (place.tags && place.tags.length > 0) {
        const category = place.tags[0]
        if (category === "음식점") {
          markerImageUrl = restaurantMarkerUrl
        } else if (category === "카페") {
          markerImageUrl = cafeMarkerUrl
        } else if (category === "놀거리") {
          markerImageUrl = entertainmentMarkerUrl
        }
      }

      // 마커 이미지 설정
      const markerImage = new window.kakao.maps.MarkerImage(markerImageUrl, new window.kakao.maps.Size(24, 35))

      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        map: map.current,
        position: position,
        title: place.place_name,
        image: markerImage,
      })

      // 인포윈도우 생성
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;font-weight:bold;">${place.place_name}</div>`,
      })

      // 마커에 마우스오버 이벤트 등록
      window.kakao.maps.event.addListener(marker, "mouseover", () => {
        infowindow.open(map.current, marker)
      })

      // 마커에 마우스아웃 이벤트 등록
      window.kakao.maps.event.addListener(marker, "mouseout", () => {
        infowindow.close()
      })

      // 마커 클릭 이벤트 등록
      window.kakao.maps.event.addListener(marker, "click", async () => {
        try {
          // 장소명으로 상세 정보 가져오기
          const placeInfo = await selectplace({ place_name: place.place_name })
          setSelectedPlaceInfo(placeInfo)
          setIsPlaceDetailModalOpen(true)
        } catch (error) {
          console.error("장소 정보 가져오기 오류:", error)
          alert("장소 정보를 가져오는데 실패했습니다.")
        }
      })

      markers.current.push(marker)
      infowindows.current.push(infowindow)

    // 모든 마커가 보이도록 지도 범위 재설정
    if (markers.current.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds()
      markers.current.forEach((marker) => {
        bounds.extend(marker.getPosition())
      })
      map.current.setBounds(bounds)
    }
    
    })
  }

  // 장소 추가 모달 열기
  const handleOpenAddPlaceModal = () => {
    setIsAddPlaceModalOpen(true)
  }

  // 장소 추가 모달 닫기
  const handleCloseAddPlaceModal = () => {
    setIsAddPlaceModalOpen(false)
  }

  // 장소 추가 완료 후 처리
  const handlePlaceAdded = () => {
    // 모든 장소 다시 로드
    loadPlaces("first", "")
  }

  // 장소 상세 모달 닫기
  const handleClosePlaceDetailModal = () => {
    setIsPlaceDetailModalOpen(false)
  }

  return (
    <>
      <Sidebar onAddPlace={handleOpenAddPlaceModal} />
      <div className="home-container">
        <div className="home-header">
          <div className="header-top">
            <h1 className="home-title">Feel Good</h1>
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                className="search-input"
                placeholder="장소명 검색..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </form>
          </div>
        </div>
        <div className="map-container" ref={mapContainer}></div>

        {/* 카테고리 필터 버튼 */}
        <div className="category-filter">
          <div className="category-buttons">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-button ${selectedCategory === category.id ? "active" : ""}`}
                style={{
                  backgroundColor: selectedCategory === category.id ? category.color : "white",
                  color: selectedCategory === category.id ? "white" : "#333",
                  borderColor: category.color,
                }}
                onClick={() => handleCategoryFilter(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 장소 추가 모달 */}
      <AddPlaceModal isOpen={isAddPlaceModalOpen} onClose={handleCloseAddPlaceModal} onPlaceAdded={handlePlaceAdded} />
      {/* 장소 상세 정보 모달 */}
      <PlaceDetailModal
        isOpen={isPlaceDetailModalOpen}
        onClose={handleClosePlaceDetailModal}
        placeInfo={selectedPlaceInfo}
        onCommentAdded={async (response) => {
          // 코멘트가 추가된 후 장소 정보 다시 가져오기
          try {
            const updatedPlaceInfo = await selectplace({ place_name: selectedPlaceInfo.place_name })
            setSelectedPlaceInfo(updatedPlaceInfo)
          } catch (error) {
            console.error("장소 정보 업데이트 오류:", error)
          }
        }}
      />
    </>
  )
}

export default Home
