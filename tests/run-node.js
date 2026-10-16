// Node 로 테스트 돌리기: node tests/run-node.js
const api = require('../app.js');
const { BOOKINGS_CSV } = require('../data/bookings.js');
const { runTests } = require('./tests.js');
const results = runTests(api, BOOKINGS_CSV);
let fail = 0;
for (const r of results) {
  console.log(`${r.ok ? '통과' : '실패'}  ${r.name}${r.ok ? '' : '  (' + r.msg + ')'}`);
  if (!r.ok) fail++;
}
console.log(`\n${results.length - fail}/${results.length} 통과`);
process.exit(fail ? 1 : 0);
