#!/usr/bin/env python3
"""
Score Jobs from Top to Bottom (Most Recent First)
Scores 'New' jobs starting from row 2 (most recent) and working down.
"""

import json
import subprocess
import sys
import os
import time

SHEET_ID = '13Ky2Rg8FA4F0-dVwh2v1ngS15J1SvbGc42V3seVsTuU'
GOG_ACCOUNT = 'isurum.aus@gmail.com'
GEMINI_KEY = 'AIzaSyChC0nfBlHqLrFoRFOXFcQZqDa9rRlXLVg'
GEMINI_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_KEY}'
BATCH_SIZE = 8  # Jobs per API call
DELAY_SEC = 5   # Delay between calls to avoid rate limits

SYSTEM_PROMPT = """You are a job scoring assistant for Isuru Munasinghe, a civil/construction engineer in Melbourne.

SCORING CRITERIA (total up to 100 points):

ROLE FIT (0-40 pts):
- Project Engineer (PE): 40 pts
- Assistant Project Manager (APM): 34 pts
- Site Engineer @ Tier-1 company: 34 pts
- Site Engineer @ smaller company: 24 pts
- Construction Manager (CM): 28 pts
- PM @ small/tier-3 company: 30 pts
- PM @ mid-size company: 18 pts
- PM @ Tier-1 company: 8 pts
- Graduate/Junior Engineer: 5 pts
- Unrelated (labourer, trades, admin, sales, IT, finance): 0 pts

LOCATION (0-20 pts):
- Melbourne metro: 20 pts
- Inner regional VIC (Geelong, Ballarat, Bendigo): 12 pts
- Outer VIC regional: 6 pts
- Interstate (NSW, QLD, SA, WA, etc.): 0 pts

SALARY (0-20 pts):
- $120K–$170K: 20 pts
- $100K–$119K: 12 pts
- $80K–$99K: 6 pts
- Not specified or unclear: 10 pts

COMPANY TYPE (0-20 pts):
- Tier-1 builder (Lendlease, John Holland, CPB, Multiplex, CIMIC, BMD, Fulton Hogan): 20 pts
- Mid-size builder: 14 pts
- Small builder / developer: 12 pts
- Consultancy / engineering firm: 12 pts
- Unknown: 8 pts

STATUS RULES:
- score >= 40 → "Scored"
- score < 40 → "Pending"

Respond ONLY with a JSON array. Each element: {"row": N, "score": N, "status": "Scored|Pending", "note": "brief 8-word max note"}
"""

def gog(cmd):
    """Run gog command with environment"""
    env = os.environ.copy()
    env.setdefault('GOG_KEYRING_PASSWORD', 'gog-openclaw-2026')
    env['GOG_KEYRING_BACKEND'] = 'file'
    
    full_cmd = ['gog'] + cmd
    result = subprocess.run(full_cmd, capture_output=True, text=True, env=env)
    
    if result.returncode != 0:
        print(f"❌ gog error: {result.stderr[:200]}")
        return None
    
    try:
        return json.loads(result.stdout)
    except:
        return result.stdout

def get_new_jobs_from_top(limit=60):
    """Get 'New' jobs starting from top (row 2)"""
    print(f"📥 Fetching jobs from top (max {limit})...")
    
    # Get all data
    data = gog(['sheets', 'get', SHEET_ID, 'Sheet1!A:L',
                '--account', GOG_ACCOUNT, '--json'])
    
    if not data or 'values' not in data:
        print("❌ Failed to get sheet data")
        return []
    
    rows = data.get('values', [])
    if len(rows) <= 1:
        print("❌ No data rows found")
        return []
    
    # Find 'New' jobs from top
    new_jobs = []
    for i, row in enumerate(rows[1:], start=2):  # Skip header
        while len(row) < 12:
            row.append('')
        
        status = row[9] if len(row) > 9 else ''
        if status == 'New':
            new_jobs.append({
                'row': i,
                'title': row[2] if len(row) > 2 else '',
                'company': row[3] if len(row) > 3 else '',
                'location': row[4] if len(row) > 4 else '',
                'state': row[5] if len(row) > 5 else '',
                'salary_min': row[6] if len(row) > 6 else '',
                'salary_max': row[7] if len(row) > 7 else '',
            })
            
            if len(new_jobs) >= limit:
                break
    
    print(f"✅ Found {len(new_jobs)} 'New' jobs from top")
    return new_jobs

def score_batch(batch):
    """Score a batch of jobs using Gemini API"""
    if not batch:
        return []
    
    lines = []
    for j in batch:
        sal = f"${j['salary_min']}-${j['salary_max']}" if j['salary_min'] else 'salary unknown'
        lines.append(f"Row {j['row']}: {j['title']} | {j['company']} | {j['location']}, {j['state']} | {sal}")
    
    prompt = "Score these jobs:\n" + "\n".join(lines)
    
    payload = {
        "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.1,
            "maxOutputTokens": 1000,
        }
    }
    
    try:
        import requests
        response = requests.post(GEMINI_URL, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()
        
        # Extract text from response
        if 'candidates' in result and len(result['candidates']) > 0:
            text = result['candidates'][0]['content']['parts'][0]['text']
            
            # Parse JSON from response
            import re
            json_match = re.search(r'\[.*\]', text, re.DOTALL)
            if json_match:
                scores = json.loads(json_match.group())
                return scores
            else:
                print(f"❌ Could not parse JSON from response: {text[:200]}")
        else:
            print(f"❌ No candidates in response: {result}")
            
    except Exception as e:
        print(f"❌ API error: {e}")
    
    return []

def update_scores(scores):
    """Update sheet with scores"""
    if not scores:
        return
    
    print(f"📤 Updating {len(scores)} scores...")
    
    for score_data in scores:
        row = score_data['row']
        score = score_data['score']
        status = score_data['status']
        note = score_data['note']
        
        # Update J (Status), K (AI Score), L (AI Notes)
        range_str = f"Sheet1!J{row}:L{row}"
        values = [[status, str(score), note]]
        
        result = gog([
            'sheets', 'update', SHEET_ID, range_str,
            '--account', GOG_ACCOUNT,
            '--values-json', json.dumps(values),
            '--json'
        ])
        
        if result and 'updatedRange' in result:
            print(f"  ✅ Row {row}: {status} ({score}) - {note}")
        else:
            print(f"  ❌ Row {row}: Failed to update")

def main():
    """Main scoring function - top to bottom"""
    print("🎯 JOB SCORING - TOP TO BOTTOM (Most Recent First)")
    print("=" * 60)
    
    # Get new jobs from top
    new_jobs = get_new_jobs_from_top(limit=60)  # Score 60 at a time
    
    if not new_jobs:
        print("✅ No 'New' jobs found to score")
        return 0
    
    print(f"\n📊 SCORING {len(new_jobs)} JOBS (rows {new_jobs[0]['row']} to {new_jobs[-1]['row']})")
    print("  Order: Most recent first (top to bottom)")
    print()
    
    # Score in batches
    total_scored = 0
    for i in range(0, len(new_jobs), BATCH_SIZE):
        batch = new_jobs[i:i+BATCH_SIZE]
        batch_num = i // BATCH_SIZE + 1
        total_batches = (len(new_jobs) + BATCH_SIZE - 1) // BATCH_SIZE
        
        print(f"🔢 Batch {batch_num}/{total_batches}: {len(batch)} jobs")
        print(f"   Rows: {batch[0]['row']} to {batch[-1]['row']}")
        
        # Score batch
        scores = score_batch(batch)
        
        if scores:
            update_scores(scores)
            total_scored += len(scores)
        
        # Delay between batches (except last batch)
        if i + BATCH_SIZE < len(new_jobs):
            print(f"⏳ Waiting {DELAY_SEC}s to avoid rate limits...")
            time.sleep(DELAY_SEC)
        
        print()
    
    print(f"✅ SCORING COMPLETE: {total_scored}/{len(new_jobs)} jobs scored")
    print()
    
    # Show summary
    print("📈 SCORING SUMMARY:")
    print(f"   Total 'New' jobs found: {len(new_jobs)}")
    print(f"   Successfully scored: {total_scored}")
    print(f"   Scoring order: Top to bottom (most recent first)")
    print(f"   First job scored: Row {new_jobs[0]['row']} ({new_jobs[0]['title'][:30]}...)")
    print(f"   Last job scored: Row {new_jobs[-1]['row']} ({new_jobs[-1]['title'][:30]}...)")
    print()
    print("🎯 Next batch will continue from where this left off.")
    
    return 0

if __name__ == '__main__':
    sys.exit(main())