import fetch from 'node-fetch';

const API_URL = 'http://localhost:4999/flight';

/**
 * 항공편 정보를 서버에서 가져오는 함수
 * @param {Object} filterBy - 검색 조건 (departure, destination)
 * @returns {Promise<Array>} - 항공편 리스트 반환
 */
export async function getFlight(filterBy = {}) {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let flights = await response.json();
    console.log("📡 전체 항공편 개수:", flights.length); // ✅ 디버깅용

    // 검색 조건이 없는 경우 전체 목록 반환
    if (!filterBy.departure && !filterBy.destination) {
      console.log("🌍 검색 조건 없음 - 전체 목록 반환");
      return flights;
    }

    // 검색 조건 적용 (출발지 및 도착지 필터링)
    if (filterBy.departure) {
      flights = flights.filter(flight => flight.departure === filterBy.departure);
    }
    if (filterBy.destination) {
      flights = flights.filter(flight => flight.destination === filterBy.destination);
    }

    console.log("🔍 필터링된 항공편 개수:", flights.length);
    return flights;
  } catch (error) {
    console.error("❌ Flight API 요청 중 오류 발생:", error);
    return [];
  }
}