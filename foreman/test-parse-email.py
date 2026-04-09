#!/usr/bin/env python3
import json, subprocess, os, re, html

def run_gog(cmd):
    env = os.environ.copy()
    env['GOG_KEYRING_PASSWORD'] = 'gog-openclaw-2026'
    if 'GOG_ACCOUNT' in env:
        del env['GOG_ACCOUNT']
    result = subprocess.run(['gog'] + cmd, capture_output=True, text=True, env=env)
    return result.stdout if result.returncode == 0 else ''

# Get one email
email_id = "19d37321476f7284"
result = run_gog(['gmail', 'get', email_id, '--account', 'isurum.aus@gmail.com', '--json'])
if not result:
    print("Failed to fetch email")
    exit(1)

email_data = json.loads(result)
body = email_data.get('body', '')

# Write HTML to file for inspection
with open('/tmp/email.html', 'w') as f:
    f.write(body)

print(f"Email body length: {len(body)} chars")
print("First 500 chars:", body[:500])

# Simple parse: look for job URLs
job_urls = re.findall(r'https://www\.seek\.com\.au/job/\d+', body)
print(f"\nFound {len(job_urls)} job URLs")
for url in job_urls[:5]:
    print(f"  {url}")

# Try to extract titles near URLs
lines = body.split('\n')
for i, line in enumerate(lines):
    if 'seek.com.au/job/' in line:
        # Look for text before/after
        for j in range(max(0, i-2), min(len(lines), i+3)):
            clean = re.sub(r'<[^>]+>', ' ', lines[j])
            clean = re.sub(r'\s+', ' ', clean).strip()
            if clean and len(clean) > 10 and len(clean) < 100:
                print(f"  Near URL: {clean[:80]}")
                break