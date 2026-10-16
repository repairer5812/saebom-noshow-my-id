// 테스트: 기대값은 원자료(가상 예약 기록 8주)에서 계산한 정답이다.
// 기준: 같은 예약ID는 첫 행만, 노쇼율 = 노쇼 ÷ (노쇼 + 이용완료), 취소 제외.
const EXPECTED = {
  "rawRows": 3418,
  "cleanRows": 3412,
  "overall": {
    "noShow": 635,
    "denom": 3161
  },
  "withCancelDenom": 3412
};

function runTests(api, csvText) {
  const results = [];
  const t = (name, fn) => {
    try { fn(); results.push({ name, ok: true }); }
    catch (e) { results.push({ name, ok: false, msg: e.message }); }
  };
  const eq = (got, want, label) => {
    if (got !== want) throw new Error(`${label}: 기대 ${want}, 실제 ${got}`);
  };
  const raw = api.parseCSV(csvText);
  const clean = api.cleanBookings(raw);

  t('CSV 를 읽으면 3,418행', () => eq(raw.length, EXPECTED.rawRows, '행 수'));
  t('같은 예약ID 중복을 빼면 3,412행', () => eq(clean.length, EXPECTED.cleanRows, '정제 후 행 수'));
  t('전체 노쇼 건수와 분모(취소 제외)', () => {
    const r = api.noShowRate(clean);
    eq(r.noShow, EXPECTED.overall.noShow, '노쇼');
    eq(r.denom, EXPECTED.overall.denom, '분모');
  });
  t('분모에 취소를 넣지 않는다', () => {
    const r = api.noShowRate(clean);
    if (!r.denom) throw new Error('분모가 0이다. 아직 계산하지 않았다');
    if (r.denom === EXPECTED.withCancelDenom) throw new Error('분모에 취소가 들어갔다');
  });
  t('전체 노쇼율은 소수 셋째 자리 반올림 0.201', () => eq(Math.round(api.noShowRate(clean).rate * 1000) / 1000, 0.201, '노쇼율'));
  // rateBy 테스트는 여기에 더한다. 기대값은 docs/자료설명.md 의 표를 쓴다.
  return results;
}

if (typeof module !== 'undefined') module.exports = { runTests, EXPECTED };
