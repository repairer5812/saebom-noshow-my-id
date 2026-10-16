// 테스트: 기대값은 원자료(가상 예약 기록 8주)에서 계산한 정답이다.
// 기준: 같은 예약ID는 첫 행만, 노쇼율 = 노쇼 ÷ (노쇼 + 이용완료), 취소 제외.
const EXPECTED = {
  "rawRows": 3418,
  "cleanRows": 3412,
  "overall": {
    "noShow": 635,
    "denom": 3161
  },
  "withCancelDenom": 3412,
  "byPay": {
    "선결제": {
      "noShow": 284,
      "denom": 1633
    },
    "현장결제": {
      "noShow": 351,
      "denom": 1528
    }
  },
  "byPayOnline": {
    "선결제": {
      "noShow": 284,
      "denom": 1633
    },
    "현장결제": {
      "noShow": 344,
      "denom": 990
    }
  },
  "byLead": {
    "1일 전": {
      "noShow": 196,
      "denom": 840
    },
    "당일": {
      "noShow": 173,
      "denom": 1322
    },
    "2~6일 전": {
      "noShow": 187,
      "denom": 735
    },
    "7일 이상 전": {
      "noShow": 79,
      "denom": 264
    }
  }
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
  t('결제 방식별 노쇼율', () => {
    const r = api.rateBy(clean, '결제방식');
    for (const k of Object.keys(EXPECTED.byPay)) {
      if (!r[k]) throw new Error(`${k} 값이 없다`);
      eq(r[k].noShow, EXPECTED.byPay[k].noShow, `${k} 노쇼`);
      eq(r[k].denom, EXPECTED.byPay[k].denom, `${k} 분모`);
    }
  });
  t('현장 경로를 빼면 현장결제 노쇼율이 크게 오른다', () => {
    const online = clean.filter((row) => row['예약경로'] !== '현장');
    const r = api.rateBy(online, '결제방식');
    eq(r['현장결제'] && r['현장결제'].noShow, EXPECTED.byPayOnline['현장결제'].noShow, '현장결제 노쇼');
    eq(r['현장결제'] && r['현장결제'].denom, EXPECTED.byPayOnline['현장결제'].denom, '현장결제 분모');
  });
  t('예약 시점별 노쇼율', () => {
    const r = api.rateBy(clean, '예약시점');
    for (const k of Object.keys(EXPECTED.byLead)) {
      if (!r[k]) throw new Error(`${k} 값이 없다`);
      eq(r[k].noShow, EXPECTED.byLead[k].noShow, `${k} 노쇼`);
      eq(r[k].denom, EXPECTED.byLead[k].denom, `${k} 분모`);
    }
  });
  return results;
}

if (typeof module !== 'undefined') module.exports = { runTests, EXPECTED };
