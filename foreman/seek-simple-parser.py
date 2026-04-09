#!/usr/bin/env python3
"""
Simple SEEK alert parser using regex only.
"""
import re, html, json, subprocess, os, sys

def parse_seek_alert_simple(html_content: str):
    """Parse SEEK alert using regex patterns."""
    # Clean up HTML
    html_content = re.sub(r'<!--.*?-->', '', html_content, flags=re.DOTALL)
    html_content = re.sub(r'<style.*?</style>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
    html_content = re.sub(r'<script.*?</script>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
    
    # Replace common HTML entities
    html_content = html.unescape(html_content)
    
    # Find all job URLs
    job_urls = re.findall(r'https://www\.seek\.com\.au/job/\d+', html_content)
    print(f"Found {len(job_urls)} job URLs")
    
    # For each URL, extract surrounding text
    jobs = []
    for url in job_urls[:30]:  # Limit
        # Find position of URL
        pos = html_content.find(url)
        if pos == -1:
            continue
        
        # Extract context around URL (500 chars before, 300 after)
        start = max(0, pos - 500)
        end = min(len(html_content), pos + 300)
        context = html_content[start:end]
        
        # Remove HTML tags
        context = re.sub(r'<[^>]+>', '  ', context)
        context = re.sub(r'\s+', ' ', context).strip()
        
        # Extract title (look for text before URL, likely title)
        title = ''
        # Split by common separators
        parts = re.split(r'[•·–—\|]', context)
        for part in parts:
            if url in part:
                # Title is likely before URL in this part
                before_url = part.split(url)[0].strip()
                if before_url and len(before_url) > 5 and len(before_url) < 100:
                    title = before_url
                    break
        
        # If no title found, use first line before URL
        if not title:
            lines = context.split('. ')
            for line in lines:
                if url in line:
                    # Get text before URL in this line
                    before = line.split(url)[0].strip()
                    if before and len(before) > 5:
                        title = before
                        break
        
        # Extract company (often after "at" or "with")
        company = ''
        company_match = re.search(r'(?:at|with|–)\s+([A-Z][A-Za-z\s&\.]+(?:Pty|Ltd|Inc|Group|Company))', context, re.IGNORECASE)
        if company_match:
            company = company_match.group(1).strip()
        
        # Extract location
        location = ''
        state = ''
        state_match = re.search(r'\b(VIC|NSW|QLD|SA|WA|TAS|NT|ACT)\b', context.upper())
        if state_match:
            state = state_match.group(1)
            # Get text around state
            loc_start = max(0, context.upper().find(state) - 40)
            loc_end = min(len(context), context.upper().find(state) + 40)
            location = context[loc_start:loc_end]
            location = re.sub(r'[^A-Za-z,\s\-]', ' ', location).strip()
            location = re.sub(r'\s+', ' ', location)
            # Remove state from location
            location = re.sub(r'\s*\b' + state + r'\b', '', location, flags=re.IGNORECASE).strip()
        
        # Extract salary
        salary = ''
        salary_min = ''
        salary_max = ''
        salary_match = re.search(r'\$[\d,\.]+\s*[kK]?\s*[-–]\s*\$[\d,\.]+\s*[kK]?', context)
        if salary_match:
            salary = salary_match.group(0)
            nums = re.findall(r'\$([\d,\.]+)[kK]?', salary)
            if len(nums) >= 2:
                salary_min = nums[0].replace(',', '')
                salary_max = nums[1].replace(',', '')
            elif len(nums) == 1:
                salary_min = nums[0].replace(',', '')
                salary_max = salary_min
        else:
            single_match = re.search(r'\$[\d,\.]+\s*[kK]?(?:\s+[pP]\.[aA]\.?)?', context)
            if single_match:
                salary = single_match.group(0)
                num = re.search(r'\$([\d,\.]+)[kK]?', salary)
                if num:
                    salary_min = num.group(1).replace(',', '')
                    salary_max = salary_min
        
        # Convert K to thousands
        if salary_min and ('k' in salary.lower() or 'K' in salary):
            salary_min = str(float(salary_min.replace('k', '').replace('K', '')) * 1000).split('.')[0]
        if salary_max and ('k' in salary.lower() or 'K' in salary):
            salary_max = str(float(salary_max.replace('k', '').replace('K', '')) * 1000).split('.')[0]
        
        # Clean title
        if title:
            title = title.strip()
            # Remove common prefixes
            title = re.sub(r'^(?:View|Apply|Open|New)\s+', '', title, flags=re.IGNORECASE)
        
        if title and len(title) > 5:
            jobs.append({
                'title': title[:200],
                'company': company[:100] if company else 'Unknown',
                'location': location[:100],
                'state': state,
                'salary': salary,
                'salary_min': salary_min,
                'salary_max': salary_max,
                'url': url,
                'source': 'SEEK',
                'date_added': '2026-03-29'
            })
    
    # Deduplicate by URL
    seen = set()
    unique = []
    for job in jobs:
        if job['url'] not in seen:
            seen.add(job['url'])
            unique.append(job)
    
    return unique

# Test
if __name__ == '__main__':
    # Fetch email
    env = os.environ.copy()
    env['GOG_KEYRING_PASSWORD'] = 'gog-openclaw-2026'
    if 'GOG_ACCOUNT' in env:
        del env['GOG_ACCOUNT']
    
    result = subprocess.run(
        ['gog', 'gmail', 'get', '19d37321476f7284', '--account', 'isurum.aus@gmail.com', '--json'],
        capture_output=True,
        text=True,
        env=env
    )
    
    if result.returncode != 0:
        print("Failed to fetch email")
        sys.exit(1)
    
    email_data = json.loads(result.stdout)
    html_content = email_data.get('body', '')
    
    print(f"Email length: {len(html_content)} chars")
    
    jobs = parse_seek_alert_simple(html_content)
    print(f"\nParsed {len(jobs)} unique jobs:")
    
    for i, job in enumerate(jobs[:15], 1):
        print(f"\n{i}. {job['title'][:60]}...")
        print(f"   Company: {job['company']}")
        print(f"   Location: {job['location']} {job['state']}")
        print(f"   Salary: {job['salary']} (min:{job['salary_min']}, max:{job['salary_max']})")
        print(f"   URL: {job['url'][:60]}...")