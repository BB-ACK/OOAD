"use client"

import { useState, useEffect } from "react"
import { addPlace } from "../utils/api"
import { getLatLngFromAddress } from "../utils/getPoint"
import "../styles/components/AddPlaceModal.css"

function AddPlaceModal({ isOpen, onClose, onPlaceAdded }) {
  const [formData, setFormData] = useState({
    place_name: "",
    address: "",
    point: "",
    tags: ["음식점"], // 기본 카테고리는 음식점
    menu: [],
    description: "",
  })

  const [menuInput, setMenuInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [locationInput, setLocationInput] = useState("")

  // 카테고리 정의
  const mainCategories = ["음식점", "카페", "놀거리"]

  const subCategories = {
    음식점: ["한식", "중식", "일식", "양식", "분식", "패스트푸드", "드링크", "기타"],
    카페: ["디저트", "베이커리", "커피", "차", "기타"],
    놀거리: ["영화", "쇼핑", "게임", "공원", "전시회", "액티비티", "기타"],
  }

  // 현재 선택된 메인 카테고리에 따른 서브 카테고리 목록
  const currentSubCategories = subCategories[formData.tags[0]] || []

  // 입력 필드 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // 메인 카테고리 선택 처리
  const handleMainCategorySelect = (category) => {
    // 메인 카테고리 변경 시 태그 배열의 첫 번째 요소만 변경
    setFormData((prev) => ({
      ...prev,
      tags: [category, ...prev.tags.filter((tag) => !mainCategories.includes(tag))],
    }))

    // 서브 카테고리 선택 초기화
    setSelectedTags([])
  }

  // 서브 카테고리 선택 처리
  const handleSubCategorySelect = (category) => {
    if (selectedTags.includes(category)) {
      // 이미 선택된 태그라면 제거
      setSelectedTags(selectedTags.filter((tag) => tag !== category))
    } else {
      // 선택되지 않은 태그라면 추가
      setSelectedTags([...selectedTags, category])
    }
  }

  // 지역 태그 추가
  const handleAddLocation = () => {
    if (locationInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, locationInput.trim()],
      }))
      setLocationInput("")
    }
  }

  // 메뉴 추가
  const handleAddMenu = () => {
    if (menuInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        menu: [...prev.menu, menuInput.trim()],
      }))
      setMenuInput("")
    }
  }

  // 메뉴 삭제
  const handleRemoveMenu = (index) => {
    setFormData((prev) => ({
      ...prev,
      menu: prev.menu.filter((_, i) => i !== index),
    }))
  }

  // 주소 입력 후 위도/경도 가져오기
  const handleGetPoint = async () => {
    if (!formData.address.trim()) {
      setError("주소를 입력해주세요.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const point = await getLatLngFromAddress(formData.address)
      if (point) {
        const [lat, lng] = point.split(", ")

        setFormData((prev) => ({
          ...prev,
          point: [lat, lng], // 배열 형태로 저장
        }))
      } else {
        setError("주소를 찾을 수 없습니다.")
      }
    } catch (error) {
      setError("위치 정보를 가져오는데 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 필수 필드 검증
    if (!formData.place_name.trim()) {
      setError("장소명을 입력해주세요.")
      return
    }

    if (!formData.address.trim()) {
      setError("주소를 입력해주세요.")
      return
    }

    if (!formData.point) {
      setError("위치 정보를 가져와주세요.")
      return
    }

    setIsLoading(true)
    setError("")

    // 최종 태그 배열 생성 (메인 카테고리 + 선택된 서브 카테고리 + 지역)
    const finalTags = [
      formData.tags[0], // 메인 카테고리
      ...selectedTags, // 선택된 서브 카테고리
      ...formData.tags.slice(1), // 지역 태그
    ]

    try {
      await addPlace({
        ...formData,
        tags: finalTags,
      })

      // 성공 시 모달 닫고 장소 목록 새로고침
      onPlaceAdded()
      onClose()
    } catch (error) {
      setError(error.message || "장소 추가에 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // 모달이 닫힐 때 폼 초기화
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        place_name: "",
        address: "",
        point: "",
        tags: ["음식점"],
        menu: [],
        description: "",
      })
      setMenuInput("")
      setSelectedTags([])
      setLocationInput("")
      setError("")
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>새 장소 추가</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-place-form">
          {error && <div className="error-message">{error}</div>}

          {/* 장소명 입력 */}
          <div className="form-group">
            <label htmlFor="place_name">장소명 *</label>
            <input
              type="text"
              id="place_name"
              name="place_name"
              value={formData.place_name}
              onChange={handleInputChange}
              placeholder="장소명을 입력하세요"
              className="form-input"
            />
          </div>

          {/* 주소 입력 */}
          <div className="form-group">
            <label htmlFor="address">주소 *</label>
            <div className="address-input-group">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="주소를 입력하세요"
                className="form-input"
              />
              <button type="button" onClick={handleGetPoint} disabled={isLoading} className="get-point-button">
                {isLoading ? "처리 중..." : "위치 가져오기"}
              </button>
            </div>
            {formData.point && <div className="point-info">위치 정보가 성공적으로 가져와졌습니다.</div>}
          </div>

          {/* 메인 카테고리 선택 */}
          <div className="form-group">
            <label>카테고리 *</label>
            <div className="category-buttons main-category">
              {mainCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`category-button ${formData.tags[0] === category ? "active" : ""}`}
                  onClick={() => handleMainCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 서브 카테고리 선택 */}
          <div className="form-group">
            <label>세부 카테고리 (다중 선택 가능)</label>
            <div className="category-buttons sub-category">
              {currentSubCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`category-button ${selectedTags.includes(category) ? "active" : ""}`}
                  onClick={() => handleSubCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 지역 태그 입력 */}
          <div className="form-group">
            <label htmlFor="location">지역 태그</label>
            <div className="tag-input-group">
              <input
                type="text"
                id="location"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="지역 태그를 입력하세요 (예: 성신, 혜화)"
                className="form-input"
              />
              <button type="button" onClick={handleAddLocation} className="add-tag-button">
                추가
              </button>
            </div>
            {formData.tags.slice(1).length > 0 && (
              <div className="tags-container">
                {formData.tags.slice(1).map((tag, index) => (
                  <span key={index} className="tag-item">
                    {tag}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          tags: [prev.tags[0], ...prev.tags.slice(1).filter((_, i) => i !== index)],
                        }))
                      }}
                      className="remove-tag"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 메뉴 입력 */}
          <div className="form-group">
            <label htmlFor="menu">메뉴</label>
            <div className="tag-input-group">
              <input
                type="text"
                id="menu"
                value={menuInput}
                onChange={(e) => setMenuInput(e.target.value)}
                placeholder="메뉴를 입력하세요"
                className="form-input"
              />
              <button type="button" onClick={handleAddMenu} className="add-tag-button">
                추가
              </button>
            </div>
            {formData.menu.length > 0 && (
              <div className="tags-container">
                {formData.menu.map((item, index) => (
                  <span key={index} className="tag-item">
                    {item}
                    <button type="button" onClick={() => handleRemoveMenu(index)} className="remove-tag">
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 설명 입력 */}
          <div className="form-group">
            <label htmlFor="description">설명</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="장소에 대한 설명을 입력하세요"
              className="form-textarea"
              rows={4}
            />
          </div>

          {/* 제출 버튼 */}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              취소
            </button>
            <button type="submit" disabled={isLoading} className="submit-button">
              {isLoading ? "처리 중..." : "장소 추가"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPlaceModal
