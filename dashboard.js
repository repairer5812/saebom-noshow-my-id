// 화면 그리기: app.js 의 계산 함수를 쓴다.
(function () {
  const rows = cleanBookings(parseCSV(BOOKINGS_CSV));
  const branchSelect = document.getElementById('branch-select');
  const branches = [...new Set(rows.map((row) => row['지점']))];
  branches.forEach((branch) => {
    const option = document.createElement('option');
    option.value = branch;
    option.textContent = branch;
    branchSelect.appendChild(option);
  });

  const timingOrder = ['당일', '1일 전', '2~6일 전', '7일 이상 전'];
  const pct = (rate) => formatPercent(rate);

  function renderBars(data, order) {
    const entries = order
      ? order.filter((key) => data[key]).map((key) => [key, data[key]])
      : Object.entries(data);
    return entries.length
      ? entries.map(([key, value]) => `<div class="bar"><span class="lab">${key}</span><span class="track"><span class="fill" style="width:${(value.rate * 100).toFixed(1)}%"></span></span><span class="num">${pct(value.rate)}</span></div>`).join('')
      : '<p class="note">표시할 예약 기록이 없습니다.</p>';
  }

  function render(selectedBranch) {
    const filteredRows = selectedBranch === '전체'
      ? rows
      : rows.filter((row) => row['지점'] === selectedBranch);
    const overall = noShowRate(filteredRows);
    document.getElementById('overall').textContent = overall.denom ? pct(overall.rate) : '계산 전';
    document.getElementById('overall-note').textContent = overall.denom ? `노쇼 ${overall.noShow}건 / 이용완료와 노쇼 ${overall.denom}건` : '표시할 예약 기록이 없습니다.';
    document.getElementById('by-pay').innerHTML = renderBars(rateBy(filteredRows, '결제방식'));
    document.getElementById('by-timing').innerHTML = renderBars(rateBy(filteredRows, '예약시점'), timingOrder);
  }

  branchSelect.addEventListener('change', (event) => render(event.target.value));
  render('전체');
})();
