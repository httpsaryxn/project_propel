-- ========================================================
-- Project Propel: Database Schema Definition
-- Target DBMS: PostgreSQL 14+
-- Normalization Standard: 3NF
-- ========================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'coordinator', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
    student_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    roll_no VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    college_email VARCHAR(255) UNIQUE NOT NULL,
    personal_email VARCHAR(255),
    phone VARCHAR(20),
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other')),
    branch VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    division VARCHAR(10),
    current_year INT CHECK (current_year BETWEEN 1 AND 4),
    passout_year INT NOT NULL,
    address TEXT,
    location_zone VARCHAR(50) CHECK (location_zone IN ('Western', 'Central', 'Harbour', 'Navi Mumbai', 'Other')),
    resume_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    skills TEXT[],
    cgpa NUMERIC(4, 2) DEFAULT NULL,
    tenth_percentage NUMERIC(5, 2) DEFAULT NULL,
    twelfth_percentage NUMERIC(5, 2) DEFAULT NULL,
    diploma_percentage NUMERIC(5, 2) DEFAULT NULL,
    active_backlogs INT DEFAULT 0,
    total_backlogs INT DEFAULT 0,
    academic_recorded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Student Semester CGPA Table
CREATE TABLE IF NOT EXISTS student_semester_cgpa (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8),
    sgpa NUMERIC(4, 2) CHECK (sgpa BETWEEN 0.00 AND 10.00),
    cgpa NUMERIC(4, 2) CHECK (cgpa BETWEEN 0.00 AND 10.00),
    UNIQUE (student_id, semester)
);

-- 4. Companies Table
CREATE TABLE IF NOT EXISTS companies (
    company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    job_profile VARCHAR(150) NOT NULL,
    job_description TEXT,
    package_lpa NUMERIC(6, 2) NOT NULL CHECK (package_lpa > 0),
    job_type VARCHAR(50) DEFAULT 'Full-Time' CHECK (job_type IN ('Full-Time', 'Internship', 'PPO', 'Contract')),
    location VARCHAR(150),
    visit_date DATE,
    hr_name VARCHAR(100),
    hr_email VARCHAR(255),
    hr_contact VARCHAR(20),
    status VARCHAR(50) DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Ongoing', 'Completed', 'Cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Company Criteria Table
CREATE TABLE IF NOT EXISTS company_criteria (
    criteria_id SERIAL PRIMARY KEY,
    company_id INT UNIQUE NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    minimum_cgpa NUMERIC(4, 2) DEFAULT 0.00 CHECK (minimum_cgpa BETWEEN 0.00 AND 10.00),
    maximum_backlogs INT DEFAULT 0 CHECK (maximum_backlogs >= 0),
    minimum_10th NUMERIC(5, 2) DEFAULT 0.00 CHECK (minimum_10th BETWEEN 0.00 AND 100.00),
    minimum_12th NUMERIC(5, 2) DEFAULT 0.00 CHECK (minimum_12th BETWEEN 0.00 AND 100.00),
    minimum_diploma NUMERIC(5, 2) DEFAULT 0.00 CHECK (minimum_diploma BETWEEN 0.00 AND 100.00),
    allowed_year INT CHECK (allowed_year BETWEEN 1 AND 4),
    gender_requirement VARCHAR(20) DEFAULT 'Any' CHECK (gender_requirement IN ('Any', 'Male', 'Female'))
);

-- 6. Company Allowed Branches Table
CREATE TABLE IF NOT EXISTS company_allowed_branches (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    branch VARCHAR(100) NOT NULL,
    UNIQUE (company_id, branch)
);

-- 7. Company Allowed Locations Table
CREATE TABLE IF NOT EXISTS company_allowed_locations (
    id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    location_zone VARCHAR(50) NOT NULL,
    UNIQUE (company_id, location_zone)
);

-- 8. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    application_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    company_id INT NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'Applied' CHECK (status IN ('Applied', 'Shortlisted', 'Interviewing', 'Rejected', 'Selected')),
    skills TEXT[] DEFAULT '{}',
    resume_url TEXT,
    cover_note TEXT,
    applied_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (student_id, company_id)
);

-- 9. Offers Table
CREATE TABLE IF NOT EXISTS offers (
    offer_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    company_id INT NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    package_lpa NUMERIC(6, 2) NOT NULL CHECK (package_lpa > 0),
    offer_date DATE DEFAULT CURRENT_DATE,
    accepted BOOLEAN DEFAULT FALSE,
    UNIQUE (student_id, company_id)
);

-- 10. Placement Results Table
CREATE TABLE IF NOT EXISTS placement_results (
    result_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    company_id INT NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    round_1 VARCHAR(50) DEFAULT 'Pending',
    round_2 VARCHAR(50) DEFAULT 'Pending',
    technical VARCHAR(50) DEFAULT 'Pending',
    hr VARCHAR(50) DEFAULT 'Pending',
    final_result VARCHAR(50) DEFAULT 'Pending' CHECK (final_result IN ('Pending', 'Cleared', 'Rejected', 'Selected')),
    UNIQUE (student_id, company_id)
);

-- 11. Company Visits Table
CREATE TABLE IF NOT EXISTS company_visits (
    visit_id SERIAL PRIMARY KEY,
    company_id INT NOT NULL REFERENCES companies(company_id) ON DELETE CASCADE,
    visit_date DATE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    description TEXT,
    notification_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    company_id INT REFERENCES companies(company_id) ON DELETE SET NULL,
    created_by INT REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Notification Recipients Table
CREATE TABLE IF NOT EXISTS notification_recipients (
    id SERIAL PRIMARY KEY,
    notification_id INT NOT NULL REFERENCES notifications(notification_id) ON DELETE CASCADE,
    student_id INT NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    UNIQUE (notification_id, student_id)
);
