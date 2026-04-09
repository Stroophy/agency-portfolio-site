#!/usr/bin/env python3
"""
Robust SEEK alert email parser.
Extracts job title, company, location, salary, URL from SEEK alert HTML.
"""
import re, html
from typing import List, Dict, Optional
from bs4 import BeautifulSoup

def parse_seek_alert(html_content: str) -> List[Dict]:
    """
    Parse SEEK job alert email HTML.
    Returns list of job dicts.
    """
    soup = BeautifulSoup(html_content, 'html.parser')
    jobs = []
    
    # SEEK alert structure: each job in a table row or div
    # Look for job cards/containers
    job_containers = []
    
    # Try multiple selectors
    selectors = [
        'table[width="100%"]',  # Common in emails
        'tr[style*="border-bottom"]',
        'div[style*="padding"]',
        'a[href*="seek.com.au/job/"]'  # Job links
    ]
    
    for sel in selectors:
        elements = soup.select(sel)
        if elements and len(elements) > 5:  # Likely job containers
            job_containers = elements
            break
    
    # If no containers found, fallback to finding all job links
    if not job_containers:
        job_links = soup.find_all('a', href=re.compile(r'seek\.com\.au/job/\d+'))
        for link in job_links:
            # Get parent container
            container = link.find_parent(['tr', 'div', 'td', 'table'])
            if container:
                job_containers.append(container)
    
    # Deduplicate containers
    seen = set()
    unique_containers = []
    for container in job_containers:
        container_str = str(container)
        if container_str not in seen:
            seen.add(container_str)
            unique_containers.append(container)
    
    print(f"Found {len(unique_containers)} job containers")
    
    # Parse each container
    for container in unique_containers[:30]:  # Limit to 30
        job = extract_job_from_container(container)
        if job and job.get('url') and job.get('title'):
            jobs.append(job)
    
    # Deduplicate by URL
    seen_urls = set()
    unique_jobs = []
    for job in jobs:
        if job['url'] not in seen_urls:
            seen_urls.add(job['url'])
            unique_jobs.append(job)
    
    return unique_jobs

def extract_job_from_container(container) -> Optional[Dict]:
    """Extract job details from a container element."""
    text = container.get_text(strip=True, separator=' ')
    html_str = str(container)
    
    # Extract URL
    url_match = re.search(r'https://www\.seek\.com\.au/job/\d+', html_str)
    if not url_match:
        return None
    url = url_match.group(0)
    
    # Extract title (often in link text or nearby)
    title = ''
    link = container.find('a', href=re.compile(r'seek\.com\.au/job/\d+'))
    if link:
        title = link.get_text(strip=True)
    
    # If no title in link, look for bold/large text
    if not title or len(title) < 5:
        bold = container.find(['b', 'strong', 'h2', 'h3'])
        if bold:
            title = bold.get_text(strip=True)
    
    # Still no title? Use first meaningful text line
    if not title or len(title) < 5:
        lines = text.split('  ')  # Double space often separates sections
        for line in lines:
            line = line.strip()
            if line and len(line) > 10 and len(line) < 100:
                title = line
                break
    
    # Extract company
    company = ''
    # Look for company after title or in specific patterns
    company_patterns = [
        r'at\s+([A-Z][A-Za-z\s&\.]+(?:Pty|Ltd|Inc|Group))',
        r'–\s+([A-Z][A-Za-z\s&\.]+(?:Pty|Ltd|Inc|Group))',
        r'with\s+([A-Z][A-Za-z\s&\.]+(?:Pty|Ltd|Inc|Group))'
    ]
    for pattern in company_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            company = match.group(1).strip()
            break
    
    # Extract location
    location = ''
    state = ''
    # Look for VIC, NSW, etc. and nearby text
    state_match = re.search(r'\b(VIC|NSW|QLD|SA|WA|TAS|NT|ACT)\b', text.upper())
    if state_match:
        state = state_match.group(1)
        # Get text around state (likely location)
        start = max(0, text.upper().find(state) - 50)
        end = min(len(text), text.upper().find(state) + 50)
        location_snippet = text[start:end]
        # Clean up
        location = re.sub(r'[^A-Za-z,\s\-]', ' ', location_snippet).strip()
        location = re.sub(r'\s+', ' ', location)
    
    # Extract salary
    salary = ''
    salary_min = ''
    salary_max = ''
    salary_match = re.search(r'\$[\d,\.]+\s*[kK]?\s*[-–]\s*\$[\d,\.]+\s*[kK]?', text)
    if salary_match:
        salary = salary_match.group(0)
        # Parse numbers
        nums = re.findall(r'\$([\d,\.]+)[kK]?', salary)
        if len(nums) >= 2:
            salary_min = nums[0].replace(',', '')
            salary_max = nums[1].replace(',', '')
        elif len(nums) == 1:
            salary_min = nums[0].replace(',', '')
            salary_max = salary_min
    else:
        # Look for single salary
        single_match = re.search(r'\$[\d,\.]+\s*[kK]?(?:\s+[pP]\.[aA]\.?)?', text)
        if single_match:
            salary = single_match.group(0)
            num = re.search(r'\$([\d,\.]+)[kK]?', salary)
            if num:
                salary_min = num.group(1).replace(',', '')
                salary_max = salary_min
    
    # Convert K to thousands
    if salary_min and 'k' in salary.lower():
        salary_min = str(float(salary_min.replace('k', '').replace('K', '')) * 1000).split('.')[0]
    if salary_max and 'k' in salary.lower():
        salary_max = str(float(salary_max.replace('k', '').replace('K', '')) * 1000).split('.')[0]
    
    # Clean up
    title = html.unescape(title).strip()
    company = html.unescape(company).strip() if company else 'Unknown'
    location = html.unescape(location).strip()
    
    # Remove state from location for cleaner display
    if state and location:
        location = re.sub(r'\s*\b' + state + r'\b', '', location, flags=re.IGNORECASE).strip()
    
    return {
        'title': title,
        'company': company,
        'location': location,
        'state': state,
        'salary': salary,
        'salary_min': salary_min,
        'salary_max': salary_max,
        'url': url,
        'source': 'SEEK',
        'date_added': '2026-03-29'  # Will be set properly
    }

# Test with actual email
if __name__ == '__main__':
    import subprocess, os, json, sys
    
    # Fetch an email
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
    
    print(f"Email HTML length: {len(html_content)} chars")
    
    jobs = parse_seek_alert(html_content)
    print(f"\nParsed {len(jobs)} jobs:")
    
    for i, job in enumerate(jobs[:10], 1):
        print(f"\n{i}. {job['title'][:50]}...")
        print(f"   Company: {job['company']}")
        print(f"   Location: {job['location']} {job['state']}")
        print(f"   Salary: {job['salary']} (min:{job['salary_min']}, max:{job['salary_max']})")
        print(f"   URL: {job['url']}")