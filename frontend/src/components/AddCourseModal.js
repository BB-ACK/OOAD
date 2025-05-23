"use client"

import { useState, useEffect } from "react"
import { addcourse } from "../utils/api"
import "../styles/components/AddCourseModal.css"

function AddCourseModal({ isOpen, onClose, onCourseAdded }) {
  const [formData, setFormData] = useState({
    course_name: "",
    place_list: [],
    description: "",
    cost: "",
  })

  const [placeInput, setPlaceInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // 입력 필드 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // 장소 추가
  const handleAddPlace = () => {
    if (placeInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        place_list: [...prev.place_list, placeInput.trim()],
      }))
      setPlaceInput("")
    }
  }

  // 장소 삭제
  const handleRemovePlace = (index) => {
    setFormData((prev) => ({
      ...prev,
      place_list: prev.place_list.filter((_, i) => i !== index),
    }))
  }

  // 장소 순서 변경 (위로)
  const handleMoveUp = (index) => {
    if (index > 0) {
      setFormData((prev) => {
        const newPlaceList = [...prev.place_list]
        ;[newPlaceList[index - 1], newPlaceList[index]] = [newPlaceList[index], newPlaceList[index - 1]]
        return {
          ...prev,
          place_list: newPlaceList,
        }
      })
    }
  }

  // 장소 순서 변경 (아래로)
  const handleMoveDown = (index) => {
    if (index < formData.place_list.length - 1) {
      setFormData((prev) => {
        const newPlaceList = [...prev.place_list]
        ;[newPlaceList[index], newPlaceList[index + 1]] = [newPlaceList[index + 1], newPlaceList[index]]
        return {
          ...prev,
          place_list: newPlaceList,
        }
      })
    }
  }

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 필수 필드 검증
    if (!formData.course_name.trim()) {
      setError("코스명을 입력해주세요.")
      return
    }

    if (formData.place_list.length === 0) {
      setError("최소 하나의 장소를 추가해주세요.")
      return
    }

    if (!formData.description.trim()) {
      setError("코스 설명을 입력해주세요.")
      return
    }

    if (!formData.cost.trim()) {
      setError("예상 비용을 입력해주세요.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await addcourse(formData)

      // 성공 시 모달 닫고 코스 목록 새로고침
      onCourseAdded()
      onClose()
    } catch (error) {
      // 백엔드에서 오는 에러 메시지 처리
      if (error.message.includes("중복되는 코스명")) {
        setError("이미 존재하는 코스명입니다. 다른 이름을 사용해주세요.")
      } else if (error.message.includes("missing_places")) {
        setError("일부 장소가 데이터베이스에 존재하지 않습니다. 장소를 먼저 추가해주세요.")
      } else {
        setError(error.message || "코스 추가에 실패했습니다.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 모달이 닫힐 때 폼 초기화
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        course_name: "",
        place_list: [],
        description: "",
        cost: "",
      })
      setPlaceInput("")
      setError("")
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>새 코스 추가</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-course-form">
          {error && <div className="error-message">{error}</div>}

          {/* 코스명 입력 */}
          <div className="form-group">
            <label htmlFor="course_name">코스명 *</label>
            <input
              type="text"
              id="course_name"
              name="course_name"
              value={formData.course_name}
              onChange={handleInputChange}
              placeholder="코스명을 입력하세요"
              className="form-input"
            />
          </div>

          {/* 장소 리스트 입력 */}
          <div className="form-group">
            <label htmlFor="place_list">장소 리스트 *</label>
            <div className="place-input-group">
              <input
                type="text"
                id="place_list"
                value={placeInput}
                onChange={(e) => setPlaceInput(e.target.value)}
                placeholder="장소명을 입력하세요"
                className="form-input"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddPlace()
                  }
                }}
              />
              <button type="button" onClick={handleAddPlace} className="add-place-button">
                추가
              </button>
            </div>
            {formData.place_list.length > 0 && (
              <div className="places-container">
                <div className="places-header">
                  <span>코스 순서 (총 {formData.place_list.length}개 장소)</span>
                </div>
                {formData.place_list.map((place, index) => (
                  <div key={index} className="place-item">
                    <span className="place-order">{index + 1}</span>
                    <span className="place-name">{place}</span>
                    <div className="place-controls">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="move-button"
                        title="위로 이동"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === formData.place_list.length - 1}
                        className="move-button"
                        title="아래로 이동"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePlace(index)}
                        className="remove-place"
                        title="삭제"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 설명 입력 */}
          <div className="form-group">
            <label htmlFor="description">코스 설명 *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="코스에 대한 설명을 입력하세요"
              className="form-textarea"
              rows={4}
            />
          </div>

          {/* 예상 비용 입력 */}
          <div className="form-group">
            <label htmlFor="cost">예상 비용 *</label>
            <input
              type="text"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleInputChange}
              placeholder="예상 비용을 입력하세요 (예: 30000)"
              className="form-input"
            />
          </div>

          {/* 제출 버튼 */}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              취소
            </button>
            <button type="submit" disabled={isLoading} className="submit-button">
              {isLoading ? "처리 중..." : "코스 추가"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCourseModal
