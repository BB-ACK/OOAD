"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import CourseSidebar from "../components/CourseSidebar"
import CourseDetail from "../components/CourseDetail"
import { isAuthenticated } from "../utils/auth"
import { fetchCourses } from "../utils/api"
import "../styles/routes/Course.css"

function Course() {
  const navigate = useNavigate()
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const markers = useRef([])
  const infowindows = useRef([])
  const polyline = useRef(null)

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

        // 지도 로드 후 코스 데이터 가져오기
        loadCourses("first", "")
      })
    }

    return () => {
      // 스크립트 제거
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [navigate])

  // 코스 데이터 가져오기
  const loadCourses = async (accessType, key) => {
    try {
      const data = await fetchCourses(accessType, key)

      if (accessType === "first") {
        // 첫 로드 시 코스 목록만 설정
        setCourses(data)
      } else if (accessType === "select") {
        // 백엔드 응답 구조에 맞게 데이터 파싱
        if (data.course_info) {
          const courseData = {
            course_name: data.course_info.course_name,
            description: data.course_info.description,
            cost: data.course_info.cost,
            place_list: data.course_info.place_list.map((placeName, index) => ({
              place_name: placeName,
              point:
                data.points[index] && data.points[index].lat && data.points[index].lng
                  ? [data.points[index].lat, data.points[index].lng]
                  : null,
              description:
                data.place_desc && data.place_desc[index] ? data.place_desc[index] : `${placeName}에 대한 설명입니다.`, // 백엔드에서 받은 설명 사용
              tags: [], // 기본 빈 태그 배열
            })),
          }

          setSelectedCourse(courseData)

          // 유효한 좌표가 있는 장소들만 지도에 표시
          const validPlaces = courseData.place_list.filter((place) => place.point !== null)
          if (map.current && validPlaces.length > 0) {
            displayCourseOnMap(validPlaces)
          } else {
            console.warn("표시할 수 있는 유효한 좌표가 없습니다.")
            // 좌표가 없는 경우 지도 초기화
            clearMapObjects()
          }
        }
      }
    } catch (error) {
      console.error("코스 데이터 가져오기 오류:", error)
    }
  }

  // 코스 선택 처리
  const handleCourseSelect = (courseName) => {
    loadCourses("select", courseName)
  }

  // 지도에 코스 표시 함수
  const displayCourseOnMap = (placeList) => {
    // 기존 마커와 인포윈도우, 폴리라인 제거
    clearMapObjects()

    // 경로를 그리기 위한 좌표 배열
    const linePath = []

    // 각 장소에 대한 마커 생성
    placeList.forEach((place, index) => {
      if (!place.point || !Array.isArray(place.point) || place.point.length < 2) {
        console.error("Invalid point data for place:", place)
        return
      }

      // 좌표 값이 유효한지 확인
      const lat = Number.parseFloat(place.point[0])
      const lng = Number.parseFloat(place.point[1])

      if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinates for place:", place)
        return
      }

      const position = new window.kakao.maps.LatLng(lat, lng)
      linePath.push(position) // 경로에 좌표 추가

      // 마커 이미지 설정 - 순서를 표시하는 번호 이미지
      const imageSrc = `https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png`
      const imageSize = new window.kakao.maps.Size(36, 37)
      const imgOptions = {
        spriteSize: new window.kakao.maps.Size(36, 691),
        spriteOrigin: new window.kakao.maps.Point(0, (index % 10) * 46 + 10),
        offset: new window.kakao.maps.Point(13, 37),
      }
      const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions)

      // 마커 생성
      const marker = new window.kakao.maps.Marker({
        map: map.current,
        position: position,
        title: place.place_name,
        image: markerImage,
        zIndex: index + 1,
      })

      // 인포윈도우 생성
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;font-weight:bold;">${index + 1}. ${place.place_name}</div>`,
      })

      // 마커에 마우스오버 이벤트 등록
      window.kakao.maps.event.addListener(marker, "mouseover", () => {
        infowindow.open(map.current, marker)
      })

      // 마커에 마우스아웃 이벤트 등록
      window.kakao.maps.event.addListener(marker, "mouseout", () => {
        infowindow.close()
      })

      markers.current.push(marker)
      infowindows.current.push(infowindow)
    })

    // 경로 선 그리기 (유효한 좌표가 2개 이상일 때만)
    if (linePath.length > 1) {
      polyline.current = new window.kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: "#FF5E00",
        strokeOpacity: 0.7,
        strokeStyle: "solid",
      })

      polyline.current.setMap(map.current)
    }

    // 모든 마커가 보이도록 지도 범위 재설정
    if (linePath.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds()
      linePath.forEach((position) => {
        bounds.extend(position)
      })
      map.current.setBounds(bounds)
    }
  }

  // 지도 객체들 초기화
  const clearMapObjects = () => {
    // 마커 제거
    markers.current.forEach((marker) => marker.setMap(null))
    markers.current = []

    // 인포윈도우 제거
    infowindows.current.forEach((infowindow) => infowindow.close())
    infowindows.current = []

    // 폴리라인 제거
    if (polyline.current) {
      polyline.current.setMap(null)
      polyline.current = null
    }
  }

  return (
    <>
      <CourseSidebar courses={courses} onCourseSelect={handleCourseSelect} />
      <div className="course-container">
        <div className="course-header">
          <h1 className="course-title">코스 추천</h1>
        </div>
        <div className="map-container" ref={mapContainer}></div>

        {/* 선택된 코스 정보 표시 */}
        {selectedCourse && <CourseDetail course={selectedCourse} />}

        {/* 코스가 선택되지 않았을 때 안내 메시지 */}
        {!selectedCourse && (
          <div className="no-course-selected">
            <p>왼쪽 사이드바에서 코스를 선택해주세요.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default Course
