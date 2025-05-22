"use client"

import "../styles/components/CourseDetail.css"

function CourseDetail({ course }) {
  if (!course) return null

  return (
    <div className="course-detail">
      <div className="course-detail-header">
        <h2 className="course-name">{course.course_name}</h2>
        <div className="course-cost">
          <span className="cost-label">예상 비용:</span>
          <span className="cost-value">{course.cost}</span>
        </div>
      </div>

      <div className="course-description">
        <p>{course.description}</p>
      </div>

      <div className="course-places">
        <h3 className="places-title">코스 경로</h3>
        <div className="places-list">
          {course.place_list && course.place_list.length > 0 ? (
            course.place_list.map((place, index) => (
              <div key={index} className="place-item">
                <div className="place-order">{index + 1}</div>
                <div className="place-content">
                  <h4 className="place-name">{place.place_name}</h4>
                  <p className="place-description">{place.description || "설명이 없습니다."}</p>
                  {place.tags && place.tags.length > 0 && (
                    <div className="place-tags">
                      {place.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="place-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="no-places">이 코스에 등록된 장소가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
