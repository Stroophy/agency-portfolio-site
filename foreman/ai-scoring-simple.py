#!/usr/bin/env python3
"""
AI Scoring Processor - Minimal version
Finds [Rule Based] rows, fetches JDs, calls Gemini, updates sheet.
"""
import json, subprocess, os, re, time, sys
from typing import List, Dict, Optional

SHEET_ID = "1Mr97Wwacpqr3j2pdhX8qaUs8ncB4GMEYuFSeb1Tn3gk"
SHEET_TAB = "Jobs"
GEMINI_KEY = "AIzaSyBjJ0JgqzsbhIBmACAypXPpktO_b3d4geg"  # Cal-W2 (Gemini 2.0 Flash)

def run_gog(cmd: List[str]) -> str:
    """Run gog command with env."""
    env = os.environ.copy()
    env['GOG_KEYRING_PASSWORD'] = 'gog-openclaw-2026'
    if 'GOG_ACCOUNT' in env:
        del env['GOG_ACCOUNT']
    
    result = subprocess.run(
        ['gog'] + cmd,
        capture_output=True,
        text=True,
        env=env
    )
    if result.returncode != 0:
        print(f"gog error: {result.stderr[:200]}")
        return '{"values":[]}'
    return result.stdout

def fetch_jd(url: str) -> Optional[str]:
    """Fetch job description from SEEK URL."""
    if 'seek.com.au' not in url:
        print(f"  ⚠️  Non-SEEK URL: {url}")
        return None
    
    try:
        import requests
        from bs4 import BeautifulSoup
    except ImportError:
        # Fallback to curl
        import urllib.request
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, timeout=10) as resp:
                html = resp.read().decode('utf-8', errors='ignore')
        except:
            print(f"  ❌ Failed to fetch {url}")
            return None
        
        # Simple regex extraction
        # Look for jobAdDetails
        patterns = [
            r'data-automation="jobAdDetails"[^>]*>([^<]+)',
            r'class="[^"]*jobAdDetails[^"]*"[^>]*>([^<]+)',
            r'<p[^>]*>([^<]+)</p>'
        ]
        for pat in patterns:
            matches = re.findall(pat, html, re.IGNORECASE)
            if matches:
                jd = ' '.join(matches[:3])
                jd = re.sub(r'\s+', ' ', jd).strip()
                if len(jd) > 100:
                    print(f"  ✅ JD excerpt: {jd[:120]}...")
                    return jd
        
        print(f"  ❌ No JD found in page")
        return None
    
    # Use requests + BeautifulSoup if available
    try:
        resp = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=10)
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # Try multiple selectors
        selectors = [
            '[data-automation="jobAdDetails"]',
            '.jobAdDetails',
            '.templatetext',
            'article',
            'div[class*="description"]'
        ]
        
        jd_text = ''
        for sel in selectors:
            elem = soup.select_one(sel)
            if elem:
                jd_text = elem.get_text(strip=True, separator=' ')
                if len(jd_text) > 100:
                    break
        
        if not jd_text or len(jd_text) < 100:
            # Fallback to all text
            jd_text = soup.get_text(strip=True, separator=' ')[:2000]
        
        jd_text = re.sub(r'\s+', ' ', jd_text).strip()
        if len(jd_text) < 50:
            print(f"  ❌ JD too short: {len(jd_text)} chars")
            return None
        
        print(f"  ✅ JD excerpt: {jd_text[:120]}...")
        return jd_text
    except Exception as e:
        print(f"  ❌ Error fetching JD: {e}")
        return None

def call_gemini(title: str, company: str, location: str, state: str, 
                salary_min: str, salary_max: str, jd_excerpt: str) -> Optional[Dict]:
    """Call Gemini API with tailored prompt."""
    import requests
    
    jd_excerpt = jd_excerpt[:500]  # Token limit
    
    prompt = f"""You are scoring job opportunities for Isuru Munasinghe, a Civil Construction Engineer with 12+ years experience.

CANDIDATE PROFILE:
- 12+ years total: 9+ years commercial building projects, 2+ years Australian infrastructure
- Strong site execution, subcontractor coordination, design coordination
- Australian experience: $800K-$100M roadworks, landscaping, LXRP projects
- Technical: site planning, subcontractor management, work sequencing, temporary works, ITPs, inspections
- Education: BE Civil Engineering (Hons)

JOB TO SCORE:
Title: {title}
Company: {company}
Location: {location}, {state}
Salary: ${salary_min}-${salary_max}K
JD Excerpt: {jd_excerpt}

SCORING CRITERIA (0-100):
1. Role Fit (0-40): Match with 12+ years civil construction, AU infrastructure experience
2. Project Alignment (0-30): Fit with AU commercial/infrastructure projects ($500K-$100M)
3. Growth & Culture (0-20): Career progression in AU market, company stability
4. Red Flags (0-10): High turnover, unrealistic expectations, poor WHS culture

Return ONLY valid JSON:
{{
  "score": <0-100>,
  "notes": "<3 bullet points matching candidate's AU infrastructure experience>",
  "strengths": "<1-2 key strengths aligned with resume>",
  "concerns": "<1-2 concerns or 'none'>"
}}

If JD is too vague/dead: {{"score":0,"notes":"Insufficient JD","strengths":"","concerns":""}}"""
    
    try:
        resp = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_KEY}",
            json={
                "contents": [{
                    "parts": [{"text": prompt}]
                }],
                "generationConfig": {
                    "temperature": 0.2,
                    "maxOutputTokens": 300
                }
            },
            timeout=30
        )
        resp.raise_for_status()
        data = resp.json()
        
        # Extract text
        text = data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
        if not text:
            print("  ❌ Empty Gemini response")
            return None
        
        # Extract JSON
        import re
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if not match:
            print(f"  ❌ No JSON in response: {text[:100]}")
            return None
        
        result = json.loads(match.group())
        score = result.get('score', 0)
        notes = result.get('notes', '')
        
        print(f"  ✅ AI Score: {score}")
        print(f"  📝 Notes: {notes[:80]}...")
        return result
        
    except Exception as e:
        print(f"  ❌ Gemini API error: {e}")
        return None

def main():
    print("AI Scoring Processor")
    print("===================")
    
    # 1. Read sheet
    print("1. Reading sheet...")
    result = run_gog(['sheets', 'get', SHEET_ID, f'{SHEET_TAB}!A1:S200', '--account', 'isurum.aus@gmail.com', '--json'])
    try:
        data = json.loads(result)
    except:
        print("Failed to parse sheet data")
        return
    
    rows = data.get('values', [])
    if not rows:
        print("No data")
        return
    
    headers = rows[0]
    col_idx = {h: i for i, h in enumerate(headers)}
    
    # Find columns
    title_col = col_idx.get('Job Title', 0)
    company_col = col_idx.get('Company', 1)
    location_col = col_idx.get('Location', 2)
    state_col = col_idx.get('State', 3)
    salary_min_col = col_idx.get('Salary Min', 4)
    salary_max_col = col_idx.get('Salary Max', 5)
    url_col = col_idx.get('Job URL', 6)
    status_col = col_idx.get('Status', 9)
    score_col = col_idx.get('AI Score', 10)  # Actually rule score
    notes_col = col_idx.get('AI Notes', 11)
    
    # 2. Find rows to process
    to_process = []
    for i, row in enumerate(rows[1:], start=2):  # i is 1-indexed row number
        if len(row) <= notes_col:
            continue
        
        notes = row[notes_col] if notes_col < len(row) else ''
        score_str = row[score_col] if score_col < len(row) else '0'
        
        # Look for rows needing AI scoring:
        # 1. "Job description extracting error" in notes (fix broken rows)
        # 2. OR notes are empty/very short (<20 chars)
        notes_lower = str(notes).lower()
        
        if 'job description extracting error' in notes_lower:
            # Fix broken rows regardless of score
            needs_ai = True
            rule_score = 1  # These have score=1
        elif not notes or len(str(notes).strip()) < 20:
            # Empty/short notes might need AI
            needs_ai = True
            try:
                rule_score = int(float(score_str))
            except:
                rule_score = 0
        else:
            needs_ai = False
            rule_score = 0
        
        if needs_ai:
            # Process if rule score >= 20 OR it's a broken row (score=1 but needs fixing)
            if rule_score >= 20 or 'job description extracting error' in notes_lower:
                to_process.append({
                    'row': i,
                    'title': row[title_col] if title_col < len(row) else '',
                    'company': row[company_col] if company_col < len(row) else '',
                    'location': row[location_col] if location_col < len(row) else '',
                    'state': row[state_col] if state_col < len(row) else '',
                    'salary_min': row[salary_min_col] if salary_min_col < len(row) else '',
                    'salary_max': row[salary_max_col] if salary_max_col < len(row) else '',
                    'url': row[url_col] if url_col < len(row) else '',
                    'rule_score': rule_score
                })
    
    print(f"Found {len(to_process)} rows with [Rule Based] and score ≥ 20")
    if not to_process:
        return
    
    # Limit to 5 per run for token control
    to_process = to_process[:5]
    
    # 3. Process each row
    updates = []
    for job in to_process:
        print(f"\n--- Row {job['row']}: {job['title'][:40]}... ---")
        
        # Fetch JD
        jd = fetch_jd(job['url'])
        if not jd:
            print("  ⏭️  Skipping - no JD")
            continue
        
        # Call Gemini
        result = call_gemini(
            job['title'], job['company'], job['location'], job['state'],
            job['salary_min'], job['salary_max'], jd
        )
        if not result:
            print("  ❌ Gemini failed")
            continue
        
        score = result.get('score', 0)
        notes = result.get('notes', '')
        strengths = result.get('strengths', '')
        concerns = result.get('concerns', '')
        
        # Build AI notes
        ai_notes = f"Score: {score} | "
        if strengths and strengths.lower() != 'none':
            ai_notes += f"Strengths: {strengths} | "
        if concerns and concerns.lower() != 'none':
            ai_notes += f"Concerns: {concerns} | "
        ai_notes += f"Notes: {notes}"
        
        if len(ai_notes) > 490:
            ai_notes = ai_notes[:487] + "..."
        
        updates.append({
            'row': job['row'],
            'score': score,
            'notes': ai_notes
        })
        
        time.sleep(2)  # Rate limit
    
    # 4. Update sheet
    if updates:
        print(f"\n4. Updating {len(updates)} rows...")
        for upd in updates:
            # Update AI Score (col K) and AI Notes (col L)
            values_json = json.dumps([[upd['score'], upd['notes']]])
            cmd = [
                'sheets', 'update', SHEET_ID, f'{SHEET_TAB}!K{upd["row"]}:L{upd["row"]}',
                '--values-json', values_json,
                '--account', 'isurum.aus@gmail.com',
                '--json'
            ]
            result = run_gog(cmd)
            print(f"  Row {upd['row']}: AI Score {upd['score']}")
            time.sleep(1)
    
    print(f"\nDone. Processed {len(updates)} jobs.")

if __name__ == '__main__':
    main()