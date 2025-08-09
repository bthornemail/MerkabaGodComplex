#!/usr/bin/env bash
set -euo pipefail
PORT="${1:-8040}"
LOG="/tmp/mcp_cli_${PORT}.log"
PID="/tmp/mcp_cli_${PORT}.pid"
cleanup() { kill "$(cat "$PID")" 2>/dev/null || true; rm -f "$PID"; }
trap cleanup EXIT
rm -f "$LOG" "$PID"
node "$(dirname "$0")/../dist/cli.js" --http "$PORT" > "$LOG" 2>&1 & echo $! > "$PID"
for i in $(seq 1 200); do
  grep -q "listening on http://localhost:$PORT/jsonrpc" "$LOG" && break
  kill -0 "$(cat "$PID")" 2>/dev/null || { echo "Server exited early"; cat "$LOG"; exit 1; }
  sleep 0.05
done
curl -fsS -H 'Content-Type: application/json' -X POST "http://localhost:$PORT/jsonrpc" --data-binary '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' >/dev/null
echo "OK: CLI HTTP initialize responded on $PORT"
