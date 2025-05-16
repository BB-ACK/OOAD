// 주소로부터 위도/경도 가져오기
export async function getLatLngFromAddress(address) {
    try {
      // Kakao Maps API 키
      const apiKey = "c64f8249c2feef10fb1de37e8b261e67" // getPoint.py에서 가져온 API 키
  
      const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`
  
      const response = await fetch(url, {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      })
  
      const result = await response.json()
  
      if (result.documents && result.documents.length > 0) {
        const lat = result.documents[0].y
        const lng = result.documents[0].x
        return `${lat}, ${lng}`
      } else {
        return null
      }
    } catch (error) {
      console.error("주소 검색 오류:", error)
      return null
    }
  }
  