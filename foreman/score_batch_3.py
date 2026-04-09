#!/usr/bin/env python3
"""
Score the third batch of jobs (rows 32-46) based on the scoring criteria.
"""

import json

def score_job(job):
    """Score a single job based on the scoring criteria."""
    
    # Scoring criteria from batch_prompts.json
    role_fit = {
        "Project Engineer (PE, Senior PE)": 40,
        "APM / Assistant Project Manager": 34,
        "Site Engineer at Tier-1/large company": 34,
        "Site Engineer at small/mid company": 24,
        "Construction Manager": 28,
        "Project Manager at small/boutique/Tier-3 company": 30,
        "Project Manager at mid-tier company": 18,
        "Project Manager at Tier-1/large company": 8,
        "Graduate/Junior/Entry-level": 5,
        "Unrelated field (IT, mining, oil & gas, healthcare, retail)": 0
    }
    
    location = {
        "Melbourne metro": 20,
        "Inner regional VIC": 12,
        "Outer VIC/remote": 6,
        "Interstate": 0
    }
    
    salary = {
        "$120K-$170K": 20,
        "$100K-$119K": 12,
        "$80K-$99K": 6,
        "not stated": 10,
        "outside range": 2
    }
    
    company = {
        "Tier-1 major contractor": 20,
        "Mid-tier contractor": 14,
        "Small/boutique civil firm": 12,
        "Consultancy/engineering firm": 12,
        "Unknown": 8
    }
    
    title = job["title"]
    company_name = job["company"]
    location_str = job["location"]
    state = job["state"]
    salary_min = job["salary_min"]
    salary_max = job["salary_max"]
    
    # Role fit scoring
    role_score = 0
    if "Project Engineer" in title and "Senior" in title:
        role_score = role_fit["Project Engineer (PE, Senior PE)"]
    elif "Project Engineer" in title:
        role_score = role_fit["Project Engineer (PE, Senior PE)"]
    elif "APM" in title or "Assistant Project Manager" in title:
        role_score = role_fit["APM / Assistant Project Manager"]
    elif "Site Engineer" in title:
        # Determine if Tier-1 or not - we'll use heuristics based on company
        if "John Holland" in company_name or "Downer" in company_name or "Fulton Hogan" in company_name:
            role_score = role_fit["Site Engineer at Tier-1/large company"]
        else:
            role_score = role_fit["Site Engineer at small/mid company"]
    elif "Project Manager" in title:
        # Determine tier based on company
        if "John Holland" in company_name or "Downer" in company_name:
            role_score = role_fit["Project Manager at Tier-1/large company"]
        elif "S&R Engineering" in company_name or "Keystone Civil" in company_name:
            role_score = role_fit["Project Manager at mid-tier company"]
        else:
            role_score = role_fit["Project Manager at small/boutique/Tier-3 company"]
    elif "Graduate" in title or "Junior" in title or "Entry-level" in title:
        role_score = role_fit["Graduate/Junior/Entry-level"]
    elif "Construction Manager" in title:
        role_score = role_fit["Construction Manager"]
    else:
        # Default to lowest score for unknown roles
        role_score = role_fit["Unrelated field (IT, mining, oil & gas, healthcare, retail)"]
    
    # Location scoring
    loc_score = 0
    if "Melbourne" in location_str and "VIC" in state:
        loc_score = location["Melbourne metro"]
    elif "VIC" in state and "Melbourne" not in location_str:
        loc_score = location["Inner regional VIC"]
    elif "VIC" in state:
        loc_score = location["Outer VIC/remote"]
    else:
        loc_score = location["Interstate"]
    
    # Salary scoring
    sal_score = 0
    if salary_min and salary_max:
        try:
            min_sal = float(salary_min.replace('$', '').replace(',', ''))
            max_sal = float(salary_max.replace('$', '').replace(',', ''))
            avg_sal = (min_sal + max_sal) / 2
            
            if 120000 <= avg_sal <= 170000:
                sal_score = salary["$120K-$170K"]
            elif 100000 <= avg_sal <= 119000:
                sal_score = salary["$100K-$119K"]
            elif 80000 <= avg_sal <= 99000:
                sal_score = salary["$80K-$99K"]
            else:
                sal_score = salary["outside range"]
        except:
            sal_score = salary["not stated"]
    else:
        sal_score = salary["not stated"]
    
    # Company scoring
    comp_score = 0
    if "John Holland" in company_name or "Downer" in company_name or "Fulton Hogan" in company_name:
        comp_score = company["Tier-1 major contractor"]
    elif "S&R Engineering" in company_name or "Keystone Civil" in company_name or "Seymour Whyte" in company_name:
        comp_score = company["Mid-tier contractor"]
    elif "Civil engineering" in company_name.lower() or "construction" in company_name.lower():
        comp_score = company["Small/boutique civil firm"]
    elif "Consulting" in company_name or "Engineering" in company_name:
        comp_score = company["Consultancy/engineering firm"]
    else:
        comp_score = company["Unknown"]
    
    # Calculate total score
    total_score = role_score + loc_score + sal_score + comp_score
    
    return {
        "role_score": role_score,
        "location_score": loc_score,
        "salary_score": sal_score,
        "company_score": comp_score,
        "total_score": total_score,
        "notes": f"Role: {role_score}, Location: {loc_score}, Salary: {sal_score}, Company: {comp_score}"
    }

def main():
    """Main function to score the third batch of jobs."""
    
    # Batch 3 contains jobs with row numbers 71-82 and 88-90, 97
    # From batch_info.json, these correspond to:
    # rows 71-82 (jobs 71-82), 88-90 (jobs 88-90), 97 (job 97)
    
    # Extract the jobs from job_scoring_data.json
    jobs = []
    
    # Jobs 71-82 (row_index 70-81)
    for i in range(70, 82):
        job_data = {
            "row_number": job_scoring_data["new_jobs"][i]["row_number"],
            "title": job_scoring_data["new_jobs"][i]["data"][2],
            "company": job_scoring_data["new_jobs"][i]["data"][3],
            "location": job_scoring_data["new_jobs"][i]["data"][4],
            "state": job_scoring_data["new_jobs"][i]["data"][5],
            "salary_min": job_scoring_data["new_jobs"][i]["data"][6],
            "salary_max": job_scoring_data["new_jobs"][i]["data"][7]
        }
        jobs.append(job_data)
    
    # Job 88 (row_index 82)
    job_data = {
        "row_number": job_scoring_data["new_jobs"][82]["row_number"],
        "title": job_scoring_data["new_jobs"][82]["data"][2],
        "company": job_scoring_data["new_jobs"][82]["data"][3],
        "location": job_scoring_data["new_jobs"][82]["data"][4],
        "state": job_scoring_data["new_jobs"][82]["data"][5],
        "salary_min": job_scoring_data["new_jobs"][82]["data"][6],
        "salary_max": job_scoring_data["new_jobs"][82]["data"][7]
    }
    jobs.append(job_data)
    
    # Job 89 (row_index 83)
    job_data = {
        "row_number": job_scoring_data["new_jobs"][83]["row_number"],
        "title": job_scoring_data["new_jobs"][83]["data"][2],
        "company": job_scoring_data["new_jobs"][83]["data"][3],
        "location": job_scoring_data["new_jobs"][83]["data"][4],
        "state": job_scoring_data["new_jobs"][83]["data"][5],
        "salary_min": job_scoring_data["new_jobs"][83]["data"][6],
        "salary_max": job_scoring_data["new_jobs"][83]["data"][7]
    }
    jobs.append(job_data)
    
    # Job 90 (row_index 84)
    job_data = {
        "row_number": job_scoring_data["new_jobs"][84]["row_number"],
        "title": job_scoring_data["new_jobs"][84]["data"][2],
        "company": job_scoring_data["new_jobs"][84]["data"][3],
        "location": job_scoring_data["new_jobs"][84]["data"][4],
        "state": job_scoring_data["new_jobs"][84]["data"][5],
        "salary_min": job_scoring_data["new_jobs"][84]["data"][6],
        "salary_max": job_scoring_data["new_jobs"][84]["data"][7]
    }
    jobs.append(job_data)
    
    # Job 97 (row_index 91)
    job_data = {
        "row_number": job_scoring_data["new_jobs"][91]["row_number"],
        "title": job_scoring_data["new_jobs"][91]["data"][2],
        "company": job_scoring_data["new_jobs"][91]["data"][3],
        "location": job_scoring_data["new_jobs"][91]["data"][4],
        "state": job_scoring_data["new_jobs"][91]["data"][5],
        "salary_min": job_scoring_data["new_jobs"][91]["data"][6],
        "salary_max": job_scoring_data["new_jobs"][91]["data"][7]
    }
    jobs.append(job_data)
    
    # Score each job
    scored_jobs = []
    for job in jobs:
        score = score_job(job)
        scored_job = {
            "row_number": job["row_number"],
            "title": job["title"],
            "company": job["company"],
            "location": job["location"],
            "state": job["state"],
            "salary_min": job["salary_min"],
            "salary_max": job["salary_max"],
            "score": score["total_score"],
            "ai_notes": score["notes"],
            "ai_score": score["total_score"]
        }
        scored_jobs.append(scored_job)
    
    # Save results to JSON
    results = {
        "batch_number": 3,
        "scored_jobs": scored_jobs,
        "total_jobs": len(scored_jobs),
        "target_salary_range": "$120K-$170K",
        "location_preference": "Melbourne, civil/building/infrastructure construction"
    }
    
    with open("batch_3_scored_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    # Print summary
    print(f"Batch 3 Scoring Results (15 jobs)")
    print("=" * 50)
    print(f"Total jobs scored: {len(scored_jobs)}")
    print()
    
    # Sort by score and show top 5
    sorted_jobs = sorted(scored_jobs, key=lambda x: x["score"], reverse=True)
    
    print("Top 5 Jobs:")
    for i, job in enumerate(sorted_jobs[:5], 1):
        print(f"{i}. Row {job['row_number']}: {job['title']} at {job['company']}")
        print(f"   Score: {job['score']} - {job['ai_notes']}")
        print()
    
    # Show full results
    print("Full Results:")
    for job in sorted_jobs:
        print(f"Row {job['row_number']}: {job['title']} at {job['company']} - Score: {job['score']}")
    
    return results

if __name__ == "__main__":
    # Load job data
    with open("/home/ubuntu/.openclaw/workspace/foreman/job_scoring_data.json", "r") as f:
        job_scoring_data = json.load(f)
    
    results = main()
    print(f"\nBatch 3 scoring complete. Results saved to batch_3_scored_results.json")