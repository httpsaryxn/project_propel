-- ========================================================
-- Project Propel: Seed Data for Testing & Development
-- ========================================================

-- Insert Users (Passwords hashed using bcrypt for "password123")
INSERT INTO users (email, password_hash, role) VALUES
('coordinator@college.edu', '$2a$10$76gP0XhHqN33yvT6f6N/.eT.Q1R.q93E1B9gD0m9e5k.g8f8O9w.i', 'coordinator'),
('john.doe@student.edu', '$2a$10$76gP0XhHqN33yvT6f6N/.eT.Q1R.q93E1B9gD0m9e5k.g8f8O9w.i', 'student'),
('jane.smith@student.edu', '$2a$10$76gP0XhHqN33yvT6f6N/.eT.Q1R.q93E1B9gD0m9e5k.g8f8O9w.i', 'student')
ON CONFLICT (email) DO NOTHING;

-- Insert Students
INSERT INTO students (user_id, roll_no, first_name, last_name, college_email, personal_email, phone, gender, branch, department, division, current_year, passout_year, address, location_zone, skills)
VALUES
(2, '101CS22001', 'John', 'Doe', 'john.doe@student.edu', 'john.personal@gmail.com', '9876543210', 'Male', 'Computer Engineering', 'Computer', 'A', 4, 2026, 'Mumbai', 'Western', ARRAY['JavaScript', 'Node.js', 'PostgreSQL', 'React']),
(3, '101IT22002', 'Jane', 'Smith', 'jane.smith@student.edu', 'jane.personal@gmail.com', '9876543211', 'Female', 'Information Technology', 'IT', 'B', 4, 2026, 'Navi Mumbai', 'Navi Mumbai', ARRAY['Python', 'Django', 'SQL', 'Data Analytics'])
ON CONFLICT (roll_no) DO NOTHING;

-- Insert Semester CGPA
INSERT INTO student_semester_cgpa (student_id, semester, sgpa, cgpa) VALUES
(1, 1, 8.50, 8.50),
(1, 2, 8.80, 8.65),
(1, 3, 9.10, 8.80),
(2, 1, 9.00, 9.00),
(2, 2, 9.20, 9.10)
ON CONFLICT (student_id, semester) DO NOTHING;

-- Insert Companies
INSERT INTO companies (company_name, job_profile, job_description, package_lpa, job_type, location, visit_date, hr_name, hr_email, hr_contact, status)
VALUES
('Google', 'Software Engineer', 'Full-stack software developer role', 18.00, 'Full-Time', 'Bangalore', '2026-09-15', 'Alice Green', 'alice@google.com', '9998887771', 'Upcoming'),
('TCS', 'Systems Engineer', 'Software maintenance and feature development', 7.00, 'Full-Time', 'Mumbai', '2026-08-20', 'Bob White', 'bob@tcs.com', '9998887772', 'Ongoing')
ON CONFLICT DO NOTHING;

-- Insert Company Criteria
INSERT INTO company_criteria (company_id, minimum_cgpa, maximum_backlogs, minimum_10th, minimum_12th, allowed_year, gender_requirement)
VALUES
(1, 8.00, 0, 75.00, 75.00, 4, 'Any'),
(2, 6.00, 2, 60.00, 60.00, 4, 'Any')
ON CONFLICT (company_id) DO NOTHING;

-- Insert Company Allowed Branches
INSERT INTO company_allowed_branches (company_id, branch) VALUES
(1, 'Computer Engineering'),
(1, 'Information Technology'),
(2, 'Computer Engineering'),
(2, 'Information Technology'),
(2, 'Electronics Engineering')
ON CONFLICT DO NOTHING;
