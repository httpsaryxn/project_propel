-- ========================================================
-- Project Propel: Stored Procedures
-- ========================================================

-- Procedure: Bulk Update Application Status
CREATE OR REPLACE PROCEDURE update_bulk_application_status(
    p_company_id INT,
    p_student_ids INT[],
    p_new_status VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE applications
    SET status = p_new_status
    WHERE company_id = p_company_id
      AND student_id = UNNEST(p_student_ids);
END;
$$;
