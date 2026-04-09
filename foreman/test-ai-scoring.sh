#!/bin/bash
# Quick test of AI scoring logic

source /home/ubuntu/.openclaw/workspace/shared/gog.env
unset GOG_ACCOUNT 2>/dev/null || true

SHEET_ID="1Mr97Wwacpqr3j2pdhX8qaUs8ncB4GMEYuFSeb1Tn3gk"

echo "Testing sheet read..."
data=$(gog sheets get "$SHEET_ID" "Jobs!A1:L20" --account isurum.aus@gmail.com --json 2>/dev/null || echo '{}')

python3 << 'PYEOF'
import json, sys
data = json.loads('''$data''')
rows = data.get('values', [])
print(f"Rows: {len(rows)}")
if rows:
    headers = rows[0]
    print("Headers:", headers)
    # Find AI Notes column
    for i, h in enumerate(headers):
        if 'AI Notes' in h:
            ai_notes_col = i
            print(f"AI Notes column: {i} ({h})")
            break
    # Check first few rows for [Rule Based]
    for i, row in enumerate(rows[1:5], start=2):
        if len(row) > ai_notes_col:
            notes = row[ai_notes_col]
            if '[Rule Based]' in str(notes):
                print(f"Row {i}: [Rule Based] found")
                title = row[0] if len(row) > 0 else ''
                print(f"  Title: {title[:50]}")
PYEOF
