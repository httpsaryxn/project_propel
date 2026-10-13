-- ========================================================
-- Project Propel: PostgreSQL Triggers
-- ========================================================

-- Rule 5 Trigger Function: Prevent application if existing accepted offer package is > 5 LPA higher
CREATE OR REPLACE FUNCTION enforce_offer_rule()
RETURNS TRIGGER AS $$
DECLARE
    v_max_accepted_package NUMERIC(6,2);
    v_target_company_package NUMERIC(6,2);
BEGIN
    -- Get highest accepted offer package for student
    SELECT MAX(package_lpa) INTO v_max_accepted_package
    FROM offers
    WHERE student_id = NEW.student_id AND accepted = TRUE;

    -- If student has an accepted offer
    IF v_max_accepted_package IS NOT NULL THEN
        -- Get new company package
        SELECT package_lpa INTO v_target_company_package
        FROM companies
        WHERE company_id = NEW.company_id;

        -- Rule 5: Cannot apply if new package is more than ₹5 LPA lower than accepted offer
        IF (v_max_accepted_package - v_target_company_package) > 5.00 THEN
            RAISE EXCEPTION 'Rule 5 Violation: Cannot apply to company with package % LPA when you hold an accepted offer of % LPA (difference > 5 LPA)', 
                v_target_company_package, v_max_accepted_package;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_enforce_offer_rule
BEFORE INSERT ON applications
FOR EACH ROW
EXECUTE FUNCTION enforce_offer_rule();


-- Notification Trigger: Dispatch notification on scheduling company visit
CREATE OR REPLACE FUNCTION notify_company_visit()
RETURNS TRIGGER AS $$
DECLARE
    v_notification_id INT;
    v_company_name VARCHAR;
BEGIN
    SELECT company_name INTO v_company_name FROM companies WHERE company_id = NEW.company_id;

    INSERT INTO notifications (title, message, company_id)
    VALUES (
        'Company Visit Scheduled: ' || v_company_name,
        'A recruitment drive for ' || v_company_name || ' is scheduled on ' || NEW.visit_date || ' at ' || NEW.venue,
        NEW.company_id
    ) RETURNING notification_id INTO v_notification_id;

    -- Add all active students as recipients
    INSERT INTO notification_recipients (notification_id, student_id)
    SELECT v_notification_id, student_id FROM students;

    UPDATE company_visits SET notification_sent = TRUE WHERE visit_id = NEW.visit_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_notify_company_visit
AFTER INSERT ON company_visits
FOR EACH ROW
EXECUTE FUNCTION notify_company_visit();
