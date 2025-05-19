"use client"
import { useState } from "react"
import "../styles/components/PlaceDetailModal.css"
import { addcomment } from "../utils/api"

function PlaceDetailModal({ isOpen, onClose, placeInfo, onCommentAdded }) {
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showCommentForm, setShowCommentForm] = useState(false)

  if (!isOpen || !placeInfo) return null

  const handleCommentChange = (e) => {
    setCommentText(e.target.value)
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault()

    if (!commentText.trim()) {
      setError("코멘트를 입력해주세요.")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // 코멘트 데이터 준비
      const commentData = {
        place_name: placeInfo.place_name,
        new_comment: commentText,
      }

      // API 호출
      const response = await addcomment(commentData)

      // 성공 시 폼 초기화 및 UI 업데이트
      setCommentText("")
      setShowCommentForm(false)

      // 부모 컴포넌트에 코멘트 추가 알림
      if (onCommentAdded) {
        onCommentAdded(response)
      }
    } catch (error) {
      setError(error.message || "코멘트 등록에 실패했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // 코멘트 데이터 형식 확인 및 표시 함수
  const renderComments = () => {
    if (!placeInfo.comments || placeInfo.comments.length === 0) {
      return <p className="no-comments">아직 코멘트가 없습니다.</p>
    }

    return (
      <div className="comments-container">
        {placeInfo.comments.map((comment, index) => {
          // 코멘트가 문자열인 경우
          if (typeof comment === "string") {
            return (
              <div key={index} className="comment-item">
                <p className="comment-text">{comment}</p>
              </div>
            )
          }
          // 코멘트가 객체인 경우 (username, date, text 구조)
          else if (typeof comment === "object") {
            return (
              <div key={index} className="comment-item">
                <div className="comment-header">
                  {comment.username && <span className="comment-author">{comment.username}</span>}
                  {comment.date && <span className="comment-date">{comment.date}</span>}
                </div>
                <p className="comment-text">{comment.text || comment.comment || JSON.stringify(comment)}</p>
              </div>
            )
          }
          // 기타 형식의 경우
          return (
            <div key={index} className="comment-item">
              <p className="comment-text">{JSON.stringify(comment)}</p>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container place-detail-modal">
        <div className="modal-header">
          <h2>{placeInfo.place_name}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-content">
          {/* 태그 섹션 */}
          <div className="detail-section">
            <div className="tags-container">
              {placeInfo.tags &&
                placeInfo.tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    #{tag}
                  </span>
                ))}
            </div>
          </div>

          {/* 주소 섹션 */}
          <div className="detail-section">
            <h3 className="section-title">주소</h3>
            <p className="section-content">{placeInfo.address}</p>
          </div>

          {/* 메뉴 섹션 - 메뉴가 있을 경우에만 표시 */}
          {placeInfo.menu && placeInfo.menu.length > 0 && (
            <div className="detail-section">
              <h3 className="section-title">대표 메뉴</h3>
              <ul className="menu-list">
                {placeInfo.menu.map((item, index) => (
                  <li key={index} className="menu-item">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 설명 섹션 - 설명이 있을 경우에만 표시 */}
          {placeInfo.description && (
            <div className="detail-section">
              <h3 className="section-title">설명</h3>
              <p className="section-content">{placeInfo.description}</p>
            </div>
          )}

          {/* 코멘트 섹션 */}
          <div className="detail-section">
            <h3 className="section-title">코멘트</h3>
            {renderComments()}

            {showCommentForm ? (
              <div className="comment-form-container">
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmitComment}>
                  <textarea
                    className="comment-textarea"
                    placeholder="코멘트를 입력하세요..."
                    value={commentText}
                    onChange={handleCommentChange}
                  />
                  <div className="comment-form-actions">
                    <button
                      type="button"
                      className="cancel-comment-button"
                      onClick={() => {
                        setShowCommentForm(false)
                        setCommentText("")
                        setError("")
                      }}
                    >
                      취소
                    </button>
                    <button type="submit" className="submit-comment-button" disabled={isSubmitting}>
                      {isSubmitting ? "등록 중..." : "등록하기"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button className="add-comment-button" onClick={() => setShowCommentForm(true)}>
                코멘트 추가
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceDetailModal
