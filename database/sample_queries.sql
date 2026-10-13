-- ========================================================
-- Project Propel: Sample Analytics & Verification Queries
-- ========================================================

-- 1. Query: List all eligible companies for a specific student (Student ID = 1)
SELECT c.company_id, c.company_name, c.job_profile, c.package_lpa
FROM companies c
WHERE check_student_eligibility(1, c.company_id) = TRUE;

-- 2. Query: Placement Percentage & Overview Statistics
SELECT * FROM placement_statistics;

-- 3. Query: Company Applicants Breakdown
SELECT * FROM company_statistics;

-- 4. Query: Branch-wise Placement Summary
SELECT 
    s.branch,
    COUNT(DISTINCT s.student_id) AS total_students,
    COUNT(DISTINCT o.student_id) AS placed_students,
    ROUND(AVG(o.package_lpa), 2) AS avg_package
FROM students s
LEFT JOIN offers o ON s.student_id = o.student_id AND o.accepted = TRUE
GROUP BY s.branch;

-- 5. Query: Top 5 Highest Paying Companies
SELECT company_name, job_profile, package_lpa, location
FROM companies
ORDER BY package_lpa DESC
LIMIT 5;
