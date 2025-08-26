"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { fetchPlaces } from "../utils/api"
import "../styles/routes/AdminPage.css"

function AdminPage() {
  const navigate = useNavigate()
  const [pendingPlaces, setPendingPlaces] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  // 카테고리 목록 (기존과 동일)
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
  ]

  useEffect(() => {
    loadPendingPlaces()
  }, [])

  // 임시 DB에서 대기 중인 장소 목록 로드
  const loadPendingPlaces = async () => {
    try {
      setIsLoading(true)
      const data = await fetchPlaces("first", "", true) // 임시 DB에서 모든 장소 가져오기
      setPendingPlaces(data)
    } catch (error) {
      setError("대기 중인 장소 목록을 불러오는데 실패했습니다.")
      console.error("데이터 로드 오류:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 검색 처리 함수
  const handleSearch = (e) => {
    e.preventDefault()
    setSelectedCategory("") // 카테고리 선택 초기화
    if (searchTerm.trim()) {
      loadFilteredPlaces("search", searchTerm.trim())
    } else {
      loadPendingPlaces()
    }
  }

  // 검색어 변경 처리 함수
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    if (e.target.value === "") {
      setSelectedCategory("")
      loadPendingPlaces()
    }
  }

  // 카테고리 필터링 함수
  const handleCategoryFilter = (category) => {
    setSearchTerm("")

    if (selectedCategory === category) {
      setSelectedCategory("")
      loadPendingPlaces()
    } else {
      setSelectedCategory(category)
      loadFilteredPlaces("tag", category)
    }
  }

  // 필터링된 장소 로드
  const loadFilteredPlaces = async (accessType, key) => {
    try {
      const data = await fetchPlaces(accessType, key, true) // 임시 DB에서 필터링된 장소 가져오기
      setPendingPlaces(data)
    } catch (error) {
      setError("장소 데이터를 불러오는데 실패했습니다.")
      console.error("필터링 데이터 로드 오류:", error)
    }
  }

  // 장소 승인 처리
  const handleApprovePlace = async (placeName) => {
    try {
      await fetchPlaces("yes", placeName, true) // 승인 처리
      alert(`"${placeName}" 장소가 승인되었습니다.`)
      loadPendingPlaces() // 목록 새로고침
    } catch (error) {
      alert("장소 승인에 실패했습니다.")
      console.error("장소 승인 오류:", error)
    }
  }

  // 장소 거부 처리
  const handleRejectPlace = async (placeName) => {
    if (!window.confirm(`"${placeName}" 장소를 거부하시겠습니까?`)) {
      return
    }

    try {
      await fetchPlaces("no", placeName, true) // 거부 처리
      alert(`"${placeName}" 장소가 거부되었습니다.`)
      loadPendingPlaces() // 목록 새로고침
    } catch (error) {
      alert("장소 거부에 실패했습니다.")
      console.error("장소 거부 오류:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <p>로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="header-top">
          <h1 className="admin-title">관리자 모드 - 대기 중인 장소</h1>
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
        <button className="back-button" onClick={() => navigate("/home")}>
          메인으로 돌아가기
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* 카테고리 필터 버튼 */}
      <div className="category-filter">
        <h3 className="category-title">카테고리</h3>
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

      {/* 장소 목록 */}
      <div className="places-container">
        <div className="places-header">
          <h3>대기 중인 장소 목록 ({pendingPlaces.length}개)</h3>
        </div>

        {pendingPlaces.length === 0 ? (
          <div className="no-places">
            <p>대기 중인 장소가 없습니다.</p>
          </div>
        ) : (
          <div className="places-grid">
            {pendingPlaces.map((place, index) => (
              <div key={place._id || place.id || index} className="place-card">
                <div className="place-header">
                  <h4 className="place-name">{place.place_name}</h4>
                  <div className="place-actions">
                    <button className="approve-btn" onClick={() => handleApprovePlace(place.place_name)} title="승인">
                      ✓
                    </button>
                    <button className="reject-btn" onClick={() => handleRejectPlace(place.place_name)} title="거부">
                      ✗
                    </button>
                  </div>
                </div>

                <div className="place-details">
                  <p className="place-address">
                    <strong>주소:</strong> {place.address}
                  </p>

                  {place.tags && place.tags.length > 0 && (
                    <div className="place-tags">
                      <strong>태그:</strong>
                      <div className="tags-list">
                        {place.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="tag-item">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {place.menu && place.menu.length > 0 && (
                    <div className="place-menu">
                      <strong>메뉴:</strong>
                      <div className="menu-list">
                        {place.menu.map((item, menuIndex) => (
                          <span key={menuIndex} className="menu-item">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {place.description && (
                    <p className="place-description">
                      <strong>설명:</strong> {place.description}
                    </p>
                  )}

                  <div className="place-meta">
                    <p>
                      <strong>등록자:</strong> {place.created_by || "알 수 없음"}
                    </p>
                    <p>
                      <strong>등록일:</strong> {place.created_at || "알 수 없음"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage
