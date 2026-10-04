#!/bin/zsh
# Serves the built static site from ./out on http://localhost:3000
cd "$(dirname "$0")/out" || { echo "Build first: npm run build"; exit 1; }
exec python3 -m http.server 3000 --bind 127.0.0.1
