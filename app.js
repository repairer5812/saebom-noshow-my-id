// 새봄스페이스 노쇼 대시보드: 계산 함수
// 이 파일의 함수는 tests.html(브라우저)과 tests/run-node.js(Node)에서 시험한다.

/** CSV 글을 행 객체 배열로 바꾼다. 첫 줄은 열 이름이다. (완성된 함수) */
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const cells = line.split(',');
    const row = {};
    header.forEach((h, i) => { row[h] = cells[i] === undefined ? '' : cells[i]; });
    return row;
  });
}

/**
 * 정제: 같은 예약ID가 여러 번 나오면 처음 한 행만 남긴다.
 * TODO: 구현하기. 지금은 받은 행을 그대로 돌려준다.
 */
function cleanBookings(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    if (seen.has(row['예약ID'])) return false;
    seen.add(row['예약ID']);
    return true;
  });
}

/**
 * 노쇼율: 노쇼 ÷ (노쇼 + 이용완료). 취소는 분모에도 넣지 않는다.
 * 돌려주는 값: { noShow: 노쇼 건수, denom: 분모 건수, rate: 0~1 사이 비율 }
 * TODO: 구현하기.
 */
function noShowRate(rows) {
  let noShow = 0;
  let denom = 0;
  rows.forEach((row) => {
    if (row['상태'] === '노쇼') {
      noShow++;
      denom++;
    } else if (row['상태'] === '이용완료') {
      denom++;
    }
  });
  return { noShow, denom, rate: denom ? noShow / denom : 0 };
}

/**
 * key 열의 값마다 noShowRate 를 구한다. 예: rateBy(rows, '결제방식')
 * 돌려주는 값: { '선결제': {noShow, denom, rate}, '현장결제': {...} }
 * TODO: 구현하기.
 */
function rateBy(rows, key) {
  const grouped = {};
  rows.forEach((row) => {
    const value = row[key];
    if (!grouped[value]) grouped[value] = [];
    grouped[value].push(row);
  });

  const result = {};
  Object.keys(grouped).forEach((value) => {
    result[value] = noShowRate(grouped[value]);
  });
  return result;
}

// 0~1 사이 비율을 '20.1%'처럼 소수 첫째 자리 백분율 글로 바꾼다
function formatPercent(rate) {
  return (rate * 100).toFixed(1) + '%';
}
if (typeof module !== 'undefined') {
  module.exports = { parseCSV, cleanBookings, noShowRate, rateBy };
}
