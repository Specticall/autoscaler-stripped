curl -XPOST \
  -H "Content-Type: application/json" \
  --data-binary @alert-test.json \
  http://localhost:9093/api/v2/alerts
