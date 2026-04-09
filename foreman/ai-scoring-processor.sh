#!/bin/bash
# AI Scoring Processor for Job Hunt Sheet
# Runs via cron, updates AI Score and AI Notes for [Rule Based] rows
# Uses Cal-W2 (Gemini 2.0 Flash) with token-optimized prompt

set -euo pipefail
cd "$(dirname "$0")"

# Config
SHEET_ID="1Mr97Wwacpqr3j2pdhX8qaUs8ncB4GMEYuFSeb1Tn3gk"
SHEET_TAB="Jobs"
LOG_DIR="./logs"
QUEUE_DIR="./queue"
mkdir -p "$LOG_DIR" "$QUEUE_DIR"

LOG_FILE="$LOG_DIR/ai-scoring-$(date +%Y%m%d-%H%M%S).log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "============================================================"
echo "AI Scoring Processor — $(date)"
echo "============================================================"

# Load gog env
source /home/ubuntu/.openclaw/workspace/shared/gog.env
unset GOG_ACCOUNT 2>/dev/null || true

# ─── Helper: fetch job description from URL ──────────────────────────────
fetch_jd() {
    local url="$1"
    local timeout=10
    local jd=""
    
    # Skip non-SEEK URLs for now
    if [[ ! "$url" =~ seek\.com\.au ]]; then
        echo "  ⚠️  Non-SEEK URL, skipping JD fetch"
        echo ""
        return 1
    fi
    
    echo "  Fetching JD from: $url"
    
    # Try to extract job description from SEEK page
    # Use curl with user-agent, follow redirects, timeout
    local html=$(curl -s -L -A "Mozilla/5.0" --max-time "$timeout" "$url" 2>/dev/null || true)
    
    if [ -z "$html" ]; then
        echo "  ❌ Failed to fetch page (timeout/error)"
        echo ""
        return 1
    fi
    
    # Extract between common SEEK JD containers
    jd=$(echo "$html" | grep -oP '(?<=data-automation="jobAdDetails"|<div[^>]*class="[^"]*jobAdDetails[^"]*"[^>]*>)[^<]+' | head -5 | tr '\n' ' ')
    
    if [ -z "$jd" ]; then
        # Fallback: look for any paragraph text
        jd=$(echo "$html" | grep -oP '<p[^>]*>[^<]+</p>' | sed 's/<[^>]*>//g' | head -3 | tr '\n' ' ')
    fi
    
    # Clean up
    jd=$(echo "$jd" | sed 's/&nbsp;/ /g; s/&amp;/\&/g; s/&lt;/</g; s/&gt;/>/g' | tr -s ' ' | sed 's/^ //; s/ $//')
    
    if [ -z "$jd" ] || [ ${#jd} -lt 50 ]; then
        echo "  ❌ Could not extract meaningful JD (length: ${#jd})"
        echo ""
        return 1
    fi
    
    echo "  ✅ JD excerpt: ${jd:0:120}..."
    echo ""
    echo "$jd"
    return 0
}

# ─── Helper: call Gemini via Cal-W2 worker ───────────────────────────────
call_gemini() {
    local title="$1"
    local company="$2"
    local location="$3"
    local state="$4"
    local salary_min="$5"
    local salary_max="$6"
    local jd_excerpt="$7"
    
    # Truncate JD to 500 chars for token savings
    jd_excerpt="${jd_excerpt:0:500}"
    
    # Construct prompt
    local prompt=$(cat <<PROMPT
You are scoring job opportunities for Isuru Munasinghe, a Civil Construction Engineer with 12+ years experience.

CANDIDATE PROFILE:
- 12+ years total: 9+ years commercial building projects, 2+ years Australian infrastructure
- Strong site execution, subcontractor coordination, design coordination
- Australian experience: \$800K-\$100M roadworks, landscaping, LXRP projects
- Technical: site planning, subcontractor management, work sequencing, temporary works, ITPs, inspections
- Education: BE Civil Engineering (Hons)

JOB TO SCORE:
Title: $title
Company: $company
Location: $location, $state
Salary: \$${salary_min}-\$${salary_max}K
JD Excerpt: $jd_excerpt

SCORING CRITERIA (0-100):
1. Role Fit (0-40): Match with 12+ years civil construction, AU infrastructure experience
2. Project Alignment (0-30): Fit with AU commercial/infrastructure projects (\$500K-\$100M)
3. Growth & Culture (0-20): Career progression in AU market, company stability
4. Red Flags (0-10): High turnover, unrealistic expectations, poor WHS culture

Return ONLY valid JSON:
{
  "score": <0-100>,
  "notes": "<3 bullet points matching candidate's AU infrastructure experience>",
  "strengths": "<1-2 key strengths aligned with resume>",
  "concerns": "<1-2 concerns or 'none'>"
}

If JD is too vague/dead: {"score":0,"notes":"Insufficient JD","strengths":"","concerns":""}
PROMPT
)
    
    echo "  Calling Gemini (Cal-W2)..."
    
    # Send to Cal-W2 worker (Gemini 2.0 Flash)
    # Using message tool to worker-06
    # We'll use sessions_send to the worker session
    # For now, simulate with curl to worker endpoint if available
    # Fallback: use direct Gemini API with worker's key
    
    # TEMPORARY: Use direct curl to Gemini API (using worker-06's key)
    # In production, replace with proper worker call
    local api_key="AIzaSyBjJ0JgqzsbhIBmACAypXPpktO_b3d4geg"  # Worker-06 key
    local response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "{
            \"contents\": [{
                \"parts\": [{\"text\": \"$prompt\"}]
            }],
            \"generationConfig\": {
                \"temperature\": 0.2,
                \"maxOutputTokens\": 300
            }
        }" \
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$api_key" 2>/dev/null || echo '{}')
    
    # Extract text from response
    local gemini_text=$(echo "$response" | grep -o '"text":"[^"]*"' | head -1 | sed 's/"text":"//; s/"$//')
    
    if [ -z "$gemini_text" ]; then
        echo "  ❌ Gemini API failed or empty response"
        return 1
    fi
    
    # Try to parse JSON from response
    local json_part=$(echo "$gemini_text" | grep -o '{.*}' || echo '')
    if [ -z "$json_part" ]; then
        echo "  ❌ No JSON found in Gemini response"
        return 1
    fi
    
    echo "$json_part"
    return 0
}

# ─── Main ───────────────────────────────────────────────────────────────
echo "1. Reading sheet..."
sheet_data=$(gog sheets get "$SHEET_ID" "${SHEET_TAB}!A1:S1000" --account isurum.aus@gmail.com --json 2>/dev/null || echo '{"values":[]}')

# Parse with python
python3 <<EOF
import json, sys, os, subprocess, time, re

data = json.loads('''$sheet_data''')
rows = data.get('values', [])
if not rows:
    print("No data in sheet")
    sys.exit(0)

headers = rows[0]
# Column indices
col_idx = {}
for i, h in enumerate(headers):
    col_idx[h] = i

# Find rows to process
to_process = []
for i, row in enumerate(rows[1:], start=2):  # i is 1-indexed row number
    if len(row) <= col_idx.get('AI Notes', 11):
        continue
    ai_notes = row[col_idx['AI Notes']] if col_idx['AI Notes'] < len(row) else ''
    rule_score = row[col_idx['AI Score']] if col_idx['AI Score'] < len(row) else '0'
    
    # Look for [Rule Based] marker
    if '[Rule Based]' in str(ai_notes):
        try:
            score_val = int(float(rule_score))
        except:
            score_val = 0
        
        # Only process if rule score >= 20
        if score_val >= 20:
            to_process.append({
                'row': i,
                'title': row[col_idx['Job Title']] if col_idx['Job Title'] < len(row) else '',
                'company': row[col_idx['Company']] if col_idx['Company'] < len(row) else '',
                'location': row[col_idx['Location']] if col_idx['Location'] < len(row) else '',
                'state': row[col_idx['State']] if col_idx['State'] < len(row) else '',
                'salary_min': row[col_idx['Salary Min']] if col_idx['Salary Min'] < len(row) else '',
                'salary_max': row[col_idx['Salary Max']] if col_idx['Salary Max'] < len(row) else '',
                'url': row[col_idx['Job URL']] if col_idx['Job URL'] < len(row) else '',
                'rule_score': score_val
            })

print(f"Found {len(to_process)} rows with [Rule Based] and score ≥ 20")
for item in to_process[:10]:  # Limit to 10 per run for token control
    print(f"  Row {item['row']}: {item['title'][:40]}... (Rule score: {item['rule_score']})")

# Write to queue file for bash processing
queue_file = "/tmp/ai_queue.json"
with open(queue_file, 'w') as f:
    json.dump(to_process[:10], f)  # Process max 10 per run
EOF

# Load queue
if [ ! -f /tmp/ai_queue.json ]; then
    echo "No rows to process."
    exit 0
fi

queue=$(cat /tmp/ai_queue.json)
count=$(echo "$queue" | python3 -c "import json,sys; print(len(json.load(sys.stdin)))")

echo ""
echo "2. Processing $count jobs..."

processed=0
errors=0
updates=()

while IFS= read -r item; do
    row=$(echo "$item" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['row'])")
    title=$(echo "$item" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['title'])")
    company=$(echo "$item" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['company'])")
    location=$(echo "$item" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['location'])")
    state=$(echo "$item" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['state'])")
    salary_min=$(echo "$item" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['salary_min'])")
    salary_max=$(echo "$item" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['salary_max'])")
    url=$(echo "$item" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['url'])")
    
    echo ""
    echo "--- Row $row: $title at $company ---"
    
    # Fetch JD
    jd=$(fetch_jd "$url")
    if [ $? -ne 0 ] || [ -z "$jd" ]; then
        echo "  ⏭️  Skipping - no JD extracted"
        errors=$((errors + 1))
        continue
    fi
    
    # Call Gemini
    result=$(call_gemini "$title" "$company" "$location" "$state" "$salary_min" "$salary_max" "$jd")
    if [ $? -ne 0 ]; then
        echo "  ❌ Gemini call failed"
        errors=$((errors + 1))
        continue
    fi
    
    # Parse result
    score=$(echo "$result" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('score', 0))" 2>/dev/null || echo "0")
    notes=$(echo "$result" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('notes', '').replace('\"', '\\\"'))" 2>/dev/null || echo "Parse error")
    strengths=$(echo "$result" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('strengths', ''))" 2>/dev/null || echo "")
    concerns=$(echo "$result" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('concerns', ''))" 2>/dev/null || echo "")
    
    # Combine notes
    ai_notes="Score: $score | "
    if [ -n "$strengths" ] && [ "$strengths" != "none" ]; then
        ai_notes+="Strengths: $strengths | "
    fi
    if [ -n "$concerns" ] && [ "$concerns" != "none" ]; then
        ai_notes+="Concerns: $concerns | "
    fi
    ai_notes+="Notes: $notes"
    
    # Truncate if too long
    if [ ${#ai_notes} -gt 490 ]; then
        ai_notes="${ai_notes:0:487}..."
    fi
    
    echo "  ✅ AI Score: $score"
    echo "  📝 AI Notes: $ai_notes"
    
    # Store for batch update
    updates+=("$row:$score:\"$ai_notes\"")
    processed=$((processed + 1))
    
    # Rate limiting
    sleep 2
    
done < <(echo "$queue" | python3 -c "import json,sys; [print(json.dumps(item)) for item in json.load(sys.stdin)]")

echo ""
echo "3. Updating sheet..."

# Batch update via gog
for update in "${updates[@]}"; do
    row=$(echo "$update" | cut -d: -f1)
    score=$(echo "$update" | cut -d: -f2)
    notes=$(echo "$update" | cut -d: -f3-)
    
    # Update AI Score (col K) and AI Notes (col L)
    values_json="[[$score, $notes]]"
    
    echo "  Updating row $row: score=$score"
    
    gog sheets update "$SHEET_ID" "${SHEET_TAB}!K${row}:L${row}" \
        --values-json "$values_json" \
        --account isurum.aus@gmail.com \
        --json >/dev/null 2>&1 || echo "  ❌ Update failed for row $row"
    
    sleep 1  # Rate limit
done

echo ""
echo "============================================================"
echo "COMPLETE — $(date)"
echo "  Processed: $processed"
echo "  Errors:    $errors"
echo "  Updated:   ${#updates[@]} rows"
echo "============================================================"