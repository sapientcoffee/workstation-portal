#!/bin/bash
# scripts/test-api.sh
# Tests the existence of the DELETE endpoint

response=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:3001/api/workstations/delete -H "Content-Type: application/json" -d '{"name": ""}')

if [ "$response" -eq 404 ]; then
  echo "FAIL: Endpoint does not exist (returned 404)."
  exit 1
elif [ "$response" -eq 400 ] || [ "$response" -eq 401 ]; then
  echo "PASS: Endpoint exists (returned $response indicating validation or auth check)."
  exit 0
else
  echo "FAIL: Unexpected response code $response."
  exit 1
fi
