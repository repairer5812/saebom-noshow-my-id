# 새봄스페이스 노쇼 대시보드(시작 저장소)

GitHub Copilot 실습 교육용 정적 웹 앱입니다. 새봄스페이스와 모든 데이터는 교육용 가상 자료입니다.

## 여는 법(설치 없음)
- 대시보드: `index.html`을 브라우저로 엽니다.
- 테스트: `tests.html`을 브라우저로 엽니다. Node가 있으면 `node tests/run-node.js`로도 돌릴 수 있습니다.

## 파일
- `app.js`: 계산 함수(parseCSV는 완성, cleanBookings, noShowRate, rateBy는 구현할 차례)
- `dashboard.js`: 화면 그리기
- `data/bookings.js`: 예약 기록 3,418행(CSV 글)
- `tests/tests.js`: 정답을 아는 테스트
- `docs/자료설명.md`: 열 설명, 노쇼율 정의, 검산 기준 숫자

## 연습 브랜치
- `practice-bugs`: 버그를 심어 둔 구현. 테스트 실패를 읽고 고치는 연습용
- `practice-injection`: 숨은 지시문이 든 문서(docs/고객의견.md). 에이전트 보안 연습용
