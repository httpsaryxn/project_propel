-- ========================================================
-- Project Propel: Database Views
-- ========================================================

-- 1. View: Eligible Students Matrix
CREATE OR REPLACE VIEW eligible_students AS
SELECT 
    s.student_id,
    s.roll_no,
    s.first_name,
    s.last_name,
    s.branch,
    s.current_year,
    s.passout_year,
    COALESCE(AVG(ssc.cgpa), 0) AS latest_cgpa,
    c.company_id,
    c.company_name,
    c.job_profile,
    c.package_lpa
FROM students s
CROSS JOIN companies c
JOIN company_criteria cc ON c.company_id = cc.company_id
LEFT JOIN student_semester_cgpa ssc ON s.student_id = ssc.student_id
GROUP BY s.student_id, c.company_id, cc.criteria_id
HAVING COALESCE(AVG(ssc.cgpa), 0) >= cc.minimum_cgpa;

-- 2. View: Placement Overall Statistics
CREATE OR REPLACE VIEW placement_statistics AS
SELECT
    COUNT(DISTINCT s.student_id) AS total_registered_students,
    COUNT(DISTINCT o.student_id) AS total_placed_students,
    ROUND((COUNT(DISTINCT o.student_id)::DECIMAL / NULLIF(COUNT(DISTINCT s.student_id), 0)) * 100, 2) AS placement_percentage,
    MAX(o.package_lpa) AS highest_package_lpa,
    ROUND(AVG(o.package_lpa), 2) AS average_package_lpa
FROM students s
LEFT JOIN offers o ON s.student_id = o.student_id AND o.accepted = TRUE;

-- 3. View: Company-wise Statistics
CREATE OR REPLACE VIEW company_statistics AS
SELECT 
    c.company_id,
    c.company_name,
    c.job_profile,
    c.package_lpa,
    COUNT(DISTINCT a.application_id) AS total_applications,
    COUNT(DISTINCT CASE WHEN o.accepted = TRUE THEN o.offer_id END) AS total_selections
FROM companies c
LEFT JOIN applications a ON c.company_id = a.company_id
LEFT JOIN offers o ON c.company_id = o.company_id
GROUP BY c.company_id;
