-- ========================================================
-- Project Propel: Database Performance Indexes
-- ========================================================

-- Index on student roll number and branch
CREATE INDEX IF NOT EXISTS idx_students_roll_no ON students(roll_no);
CREATE INDEX IF NOT EXISTS idx_students_branch ON students(branch);
CREATE INDEX IF NOT EXISTS idx_students_passout_year ON students(passout_year);

-- Index on company metrics
CREATE INDEX IF NOT EXISTS idx_companies_package_lpa ON companies(package_lpa DESC);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);

-- Foreign key indexes for rapid join queries
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_company_id ON applications(company_id);
CREATE INDEX IF NOT EXISTS idx_offers_student_id ON offers(student_id);
CREATE INDEX IF NOT EXISTS idx_offers_company_id ON offers(company_id);
CREATE INDEX IF NOT EXISTS idx_placement_results_student_id ON placement_results(student_id);
CREATE INDEX IF NOT EXISTS idx_notification_recipients_student_id ON notification_recipients(student_id);
