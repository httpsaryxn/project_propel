-- ========================================================
-- Project Propel: Additional Constraints & Integrity Rules
-- ========================================================

-- Constraint 1: Check college email domain format
ALTER TABLE students 
ADD CONSTRAINT chk_student_college_email 
CHECK (college_email LIKE '%@%.%');

-- Constraint 2: Ensure package LPA positive
ALTER TABLE companies 
ADD CONSTRAINT chk_company_package_positive 
CHECK (package_lpa > 0.0);

-- Constraint 3: Ensure passout year is valid
ALTER TABLE students 
ADD CONSTRAINT chk_student_passout_year 
CHECK (passout_year BETWEEN 2000 AND 2100);
