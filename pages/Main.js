import Head from 'next/head';
import { useEffect, useState } from 'react';
import { getFlight } from '../api/FlightDataApi';
import FlightList from './component/FlightList';
import LoadingIndicator from './component/LoadingIndicator';
import Search from './component/Search';
import Debug from './component/Debug';

export default function Main() {
  const [condition, setCondition] = useState({
    departure: 'ICN',
    destination: '',
  });
  const [flightList, setFlightList] = useState([]); // ✅ 빈 배열로 초기화
  const [loading, setLoading] = useState(false); // ✅ 로딩 상태 추가

  // ✅ API 요청을 목적지가 없을 때도 실행하도록 수정
  useEffect(() => {
    setLoading(true); // ✅ 로딩 시작

    getFlight(condition)
      .then((data) => {
        setFlightList(data);
      })
      .catch((error) => {
        console.error('Error fetching flights:', error);
      })
      .finally(() => {
        setLoading(false); // ✅ 로딩 종료
      });
  }, [condition]); // ✅ 목적지가 없어도 실행됨

  // ✅ 검색 함수 수정 (API 요청을 트리거하도록 변경)
  const search = ({ departure, destination }) => {
    console.log('condition 상태를 변경시킵니다');

    setCondition({
      departure: departure || condition.departure,
      destination: destination || '', // 목적지가 없으면 빈 값으로 설정
    });
  };

  global.search = search; // ✅ 테스트를 위해 유지

  return (
    <div>
      <Head>
        <title>Airline</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>여행가고 싶을 땐, Airline</h1>
        <Search onSearch={search} />

        {loading ? (
          <LoadingIndicator /> // ✅ API 요청 중 로딩 상태 표시
        ) : (
          <div className="table">
            <div className="row-header">
              <div className="col">출발</div>
              <div className="col">도착</div>
              <div className="col">출발 시각</div>
              <div className="col">도착 시각</div>
              <div className="col"></div>
            </div>
            <FlightList list={flightList} />
          </div>
        )}

        <div className="debug-area">
          <Debug condition={condition} />
        </div>
      </main>
    </div>
  );
}