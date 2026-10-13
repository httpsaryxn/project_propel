-- ========================================================
-- Project Propel: Stored Functions
-- ========================================================

-- 1. Function: Check Student Eligibility for a specific company
CREATE OR REPLACE FUNCTION check_student_eligibility(
    p_student_id INT,
    p_company_id INT
)
RETURNS BOOLEAN AS $$
DECLARE
    v_student_branch VARCHAR;
    v_student_cgpa NUMERIC;
    v_student_year INT;
    v_student_gender VARCHAR;
    v_student_zone VARCHAR;
    v_min_cgpa NUMERIC;
    v_req_gender VARCHAR;
    v_allowed_year INT;
    v_branch_allowed BOOLEAN;
    v_zone_allowed BOOLEAN;
BEGIN
    -- Fetch student details
    SELECT branch, current_year, gender, location_zone
    INTO v_student_branch, v_student_year, v_student_gender, v_student_zone
    FROM students WHERE student_id = p_student_id;

    -- Fetch latest CGPA
    SELECT COALESCE(MAX(cgpa), 0) INTO v_student_cgpa
    FROM student_semester_cgpa WHERE student_id = p_student_id;

    -- Fetch company criteria
    SELECT minimum_cgpa, gender_requirement, allowed_year
    INTO v_min_cgpa, v_req_gender, v_allowed_year
    FROM company_criteria WHERE company_id = p_company_id;

    -- CGPA check
    IF v_student_cgpa < v_min_cgpa THEN
        RETURN FALSE;
    END IF;

    -- Gender check
    IF v_req_gender <> 'Any' AND v_req_gender <> v_student_gender THEN
        RETURN FALSE;
    END IF;

    -- Year check
    IF v_allowed_year IS NOT NULL AND v_allowed_year <> v_student_year THEN
        RETURN FALSE;
    END IF;

    -- Branch check
    SELECT EXISTS (
        SELECT 1 FROM company_allowed_branches 
        WHERE company_id = p_company_id AND branch = v_student_branch
    ) INTO v_branch_allowed;

    IF NOT v_branch_allowed AND EXISTS (SELECT 1 FROM company_allowed_branches WHERE company_id = p_company_id) THEN
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 2. Function: Apply Student to Company with validation
CREATE OR REPLACE FUNCTION apply_student(
    p_student_id INT,
    p_company_id INT
)
RETURNS VARCHAR AS $$
DECLARE
    v_is_eligible BOOLEAN;
BEGIN
    v_is_eligible := check_student_eligibility(p_student_id, p_company_id);
    IF NOT v_is_eligible THEN
        RAISE EXCEPTION 'Student % is not eligible for company %', p_student_id, p_company_id;
    END IF;

    INSERT INTO applications (student_id, company_id, status)
    VALUES (p_student_id, p_company_id, 'Applied')
    ON CONFLICT (student_id, company_id) DO NOTHING;

    RETURN 'Application submitted successfully';
END;
$$ LANGUAGE plpgsql;

-- 3. Function: Get Company Analytics Summary
CREATE OR REPLACE FUNCTION get_company_statistics(p_company_id INT)
RETURNS TABLE (
    company_name VARCHAR,
    total_applicants BIGINT,
    shortlisted_applicants BIGINT,
    selected_applicants BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.company_name,
        COUNT(a.application_id) AS total_applicants,
        COUNT(CASE WHEN a.status = 'Shortlisted' THEN 1 END) AS shortlisted_applicants,
        COUNT(CASE WHEN a.status = 'Selected' THEN 1 END) AS selected_applicants
    FROM companies c
    LEFT JOIN applications a ON c.company_id = a.company_id
    WHERE c.company_id = p_company_id
    GROUP BY c.company_name;
END;
$$ LANGUAGE plpgsql;
