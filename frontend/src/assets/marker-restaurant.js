// 음식점 마커 아이콘 SVG
export const restaurantMarkerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="35" viewBox="0 0 24 35">
  <g fill="none" fill-rule="evenodd">
    <path fill="#FF6B6B" d="M12 0c6.627 0 12 5.373 12 12 0 4.127-2.393 7.934-6.642 11.422l-.203.165L12 28l-5.155-4.413-.203-.165C2.393 19.934 0 16.127 0 12 0 5.373 5.373 0 12 0z"/>
    <path fill="#FFF" d="M7 7h2v8H7zm4 0h2v8h-2zm4 0h2v8h-2zM7 17h10v2H7z"/>
  </g>
</svg>
`

// Base64 인코딩 함수
export function svgToBase64(svg) {
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

// 마커 이미지 URL 생성
export const restaurantMarkerUrl = svgToBase64(restaurantMarkerSvg)
