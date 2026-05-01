#!/bin/bash
# CareerStudy — servidor local simples
# Uso: ./start.sh (abre automaticamente no browser)

PORT=8080
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "CareerStudy iniciando em http://localhost:$PORT"
echo "Ctrl+C pra parar"

# abre o browser automaticamente
sleep 0.5 && open "http://localhost:$PORT" &

# serve os arquivos
cd "$DIR"
if command -v python3 &>/dev/null; then
  python3 -m http.server $PORT
elif command -v python &>/dev/null; then
  python -m SimpleHTTPServer $PORT
else
  echo "Python nao encontrado — instale Python 3 ou use: npx serve ."
fi
