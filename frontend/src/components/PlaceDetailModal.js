"use client"
import "../styles/components/PlaceDetailModal.css"

function PlaceDetailModal({ isOpen, onClose, placeInfo }) {
  if (!isOpen || !placeInfo) return null

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
            {placeInfo.comments && placeInfo.comments.length > 0 ? (
              <div className="comments-container">
                {placeInfo.comments.map((comment, index) => (
                  <div key={index} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{comment.username}</span>
                      <span className="comment-date">{comment.date}</span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-comments">아직 코멘트가 없습니다.</p>
            )}
            <button className="add-comment-button">코멘트 추가</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceDetailModal
