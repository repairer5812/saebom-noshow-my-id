// 화면 그리기: app.js 의 계산 함수를 쓴다.
(function () {
  const rows = cleanBookings(parseCSV(BOOKINGS_CSV));
  const pct = (x) => (x * 100).toFixed(1) + '%';
  const all = noShowRate(rows);
  document.getElementById('overall').textContent = all.denom ? pct(all.rate) : '계산 전';
  document.getElementById('overall-note').textContent = all.denom ? `노쇼 ${all.noShow}건 / 이용완료와 노쇼 ${all.denom}건` : 'app.js 의 함수를 먼저 구현하세요';
  const byPay = rateBy(rows, '결제방식');
  const box = document.getElementById('by-pay');
  box.innerHTML = Object.keys(byPay).length
    ? Object.entries(byPay).map(([k, v]) => `<div class="bar"><span class="lab">${k}</span><span class="track"><span class="fill" style="width:${(v.rate * 100 * 2).toFixed(1)}%"></span></span><span class="num">${pct(v.rate)}</span></div>`).join('')
    : '<p class="note">rateBy 를 구현하면 막대가 나타납니다.</p>';
})();
