// k6 against minio s3 via plain http puts. uses s3 rest signing? no —
// keep it simple: hit the health endpoints under load + one authenticated
// roundtrip via presigned flow is overkill here. Availability + latency only.
// run: k6 run k6/load.js -e BASE_URL=http://localhost:8101
import http from 'k6/http';
import { check } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:8101';

export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '3m', target: 50 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<300'],
  },
};

export default function () {
  const live = http.get(`${BASE}/minio/health/live`);
  check(live, { 'live 200': (r) => r.status === 200 });
  const ready = http.get(`${BASE}/minio/health/ready`);
  check(ready, { 'ready 200': (r) => r.status === 200 });
}
