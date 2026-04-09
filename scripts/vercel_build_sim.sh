#!/usr/bin/env bash
set -euo pipefail
rm -rf node_modules .next

# simulate Vercel-ish install choices that often omit optional deps
npm ci --omit=optional

# if optional native deps were skipped, lightningcss will be broken
node -e "try{require('lightningcss'); console.log('lightningcss OK')}catch(e){console.error('lightningcss FAIL:', e.message); process.exit(1)}"

npm run build
