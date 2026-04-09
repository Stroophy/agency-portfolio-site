# Job Google Sheet Issues Report
**Date:** 2026-04-07  
**Sheet:** `13Ky2Rg8FA4F0-dVwh2v1ngS15J1SvbGc42V3seVsTuU`  
**Total Jobs:** 160

## 📊 EXECUTIVE SUMMARY

The job sheet has **significant data quality issues** affecting automation and decision-making:
- **52.5%** of jobs (84) are not scored ("New" status)
- **Column structure inconsistent** across rows
- **Salary data missing** for 88% of jobs
- **No application tracking** (Actioned column empty)

## 🔍 DETAILED ISSUES

### 1. **SCORING STATUS PROBLEMS** (CRITICAL)
- **84 jobs** marked as "New" - Not scored at all
- **31 jobs** marked as "Pending" - Scored but below 40 threshold
- **45 jobs** marked as "Scored" - Properly evaluated
- **Scoring completion:** Only 28.1% of jobs fully scored

### 2. **COLUMN INCONSISTENCY** (HIGH)
- **Expected:** 13 columns (A-M)
- **Actual:** Many rows have only 10-12 columns
- **Missing columns:** Salary Min/Max (G-H), AI Score/Notes (K-L), Actioned (M)
- **Impact:** Automation scripts fail due to column index mismatches

### 3. **DATA QUALITY ISSUES** (MEDIUM)
- **Salary data:** 88.1% of jobs missing salary information
- **AI Notes:** 51.9% empty (even for scored jobs)
- **Actioned column:** 100% empty - No tracking of applications
- **Recent jobs:** Jobs from 07/04/2026 not yet scored

### 4. **SCORING DISTRIBUTION ANALYSIS**
- **Average score:** 60.5 (scored jobs only)
- **Score range:** 40-90
- **Most common scores:** 50 (9 jobs), 45 (7 jobs), 60 (5 jobs), 80 (5 jobs)
- **High-scoring jobs (≥80):** 10 jobs (22% of scored jobs)

## 📋 SAMPLE PROBLEM ROWS

### Row 2 (New, not scored):
- Project Engineer / Project Manager @ Carpe Diem Solutions
- Missing: Salary data, AI Score, AI Notes
- Status: New (should be scored)

### Rows 41-50 (Pending, low scores):
- All interstate jobs with scores 25-34
- Common reasons: "Graduate role, interstate", "Civil engineer, interstate"
- Below 40 threshold → marked as Pending

### Recent Jobs (07/04/2026):
- 9 new jobs from today not scored
- Includes: Project Engineer - Hyperscale Data Centers, Senior Pre-Construction Manager, etc.

## 🎯 ROOT CAUSES

1. **Scoring automation failure:** Direct scoring script hit API rate limits
2. **Worker configuration:** Fixed gog access but workers not triggered
3. **Data ingestion:** Salary data not captured during job collection
4. **Column management:** Inconsistent column counts across rows
5. **Application tracking:** No process to update Actioned column

## ✅ RECOMMENDED FIXES

### IMMEDIATE ACTIONS (Today):
1. **Score 84 "New" jobs** using fixed worker prompts
   ```bash
   # Message workers with updated prompts
   message worker-05 "Score your batch of jobs"
   message worker-06 "Score your batch of jobs"
   ```

2. **Fix column structure** for all rows
   ```bash
   # Run column fix script
   python3 fix_job_sheet_columns.py
   ```

3. **Archive low-scoring jobs** (Pending, score < 40)
   - Move to separate "Archive" tab
   - Keep for reference but remove from active list

### SHORT-TERM IMPROVEMENTS (This week):
4. **Implement application tracking**
   - Add "Applied", "Interview", "Rejected" statuses to Actioned column
   - Create simple form to update status

5. **Improve salary data collection**
   - Enhance job ingestion script to extract salary from SEEK
   - Add salary range validation

6. **Set up reliable scoring cron**
   - Daily scoring of new jobs
   - Rate limit handling
   - Failure notifications

### LONG-TERM SOLUTIONS:
7. **Data validation pipeline**
   - Pre-ingestion validation
   - Automatic column alignment
   - Duplicate detection

8. **Dashboard/reporting**
   - Weekly scoring summary
   - Top opportunities report
   - Application tracking dashboard

## 🚨 URGENT PRIORITIES

1. **Score the 84 unscored jobs** - Critical for decision making
2. **Fix column inconsistency** - Required for automation to work
3. **Set up application tracking** - Essential for follow-up

## 📈 METRICS TO MONITOR

- **Scoring completion rate:** Target 100% within 24h of job addition
- **Data quality score:** Target <5% missing salary data
- **Application rate:** Track % of high-scoring jobs applied to
- **Column consistency:** Target 100% rows with 13 columns

---

**Next Steps:** 
1. Run scoring for 84 new jobs using workers
2. Execute column fix script
3. Review and archive low-scoring pending jobs
4. Set up application tracking process