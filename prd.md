# Project Propel
## Placement Analytics & Recruitment Management System (PARMS)

**Version:** 1.0  
**Project Type:** DBMS Mini Project  
**Primary Focus:** Database Design, Normalization, PostgreSQL Relations, Triggers, Functions, Views & Analytics

---

# 1. Project Overview

## Problem Statement

The Training & Placement Cell of a college currently manages student information, company details, applications, placement results, and statistics manually using spreadsheets. This leads to redundant data, inefficient filtering of eligible students, poor analytics, and time-consuming management.

## Proposed Solution

Project Propel is a centralized Placement Analytics & Recruitment Management System that automates the complete placement process while emphasizing PostgreSQL database concepts such as:

- Normalized Database Design (3NF)
- Foreign Keys
- Constraints
- Views
- Triggers
- Stored Functions
- Transactions
- Analytics Queries

---

# 2. Technology Stack

| Layer | Technology |
|---------|------------|
| Frontend | React + Vite |
| Styling | TailwindCSS |
| Charts | Chart.js |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Authentication | JWT + bcrypt |
| API | REST |
| Version Control | Git |
| Database Hosting | Supabase |
| Backend Hosting | Render |
| Frontend Hosting | Vercel |

---

# 3. User Roles

## Student

- Register/Login
- Complete Profile
- Update Profile
- View Eligible Companies
- Apply for Companies
- View Applications
- View Offers
- Receive Notifications

---

## Training & Placement Coordinator

- Login
- Manage Companies
- Manage Students
- Manage Eligibility Criteria
- Upload Placement Results
- View Analytics
- Send Notifications
- Schedule Company Visits

---

# 4. Functional Requirements

## Student Module

- Authentication
- Student Profile
- Semester-wise Academic Records
- Resume Management
- Company Eligibility
- Applications
- Offers
- Notifications

---

## T&P Module

- Company Management
- Company Criteria
- Student Management
- Applications Management
- Placement Results
- Placement Analytics
- Notification Management
- Company Visit Schedule

---

# 5. Business Rules

### Rule 1

Students fill their profile only once.

Whenever they apply for a company, only the required fields are fetched.

---

### Rule 2

Eligibility is calculated automatically using the Company Criteria table.

---

### Rule 3

Only eligible students are allowed to apply.

---

### Rule 4

All applied students appear in the T&P Dashboard.

---

### Rule 5

If a student already has an accepted offer,

They cannot apply for another company whose package is **more than ₹5 LPA lower** than the accepted offer.

This rule will be enforced using a PostgreSQL Trigger.

---

### Rule 6

Students receive notifications whenever a company visit is scheduled.

---

# 6. Database Design

## Tables

```
users

students

student_semester_cgpa

companies

company_criteria

company_allowed_branches

company_allowed_locations

applications

offers

placement_results

company_visits

notifications

notification_recipients
```

---

# 7. Table Overview

## Users

```
user_id

email

password_hash

role

created_at

last_login
```

---

## Students

```
student_id

user_id

roll_no

first_name

last_name

college_email

personal_email

phone

gender

branch

department

division

current_year

passout_year

address

location_zone

resume_url

linkedin_url

github_url

skills

created_at

updated_at
```

---

## Student Semester CGPA

```
id

student_id

semester

sgpa

cgpa
```

---

## Companies

```
company_id

company_name

job_profile

job_description

package_lpa

job_type

location

visit_date

hr_name

hr_email

hr_contact

status
```

---

## Company Criteria

```
criteria_id

company_id

minimum_cgpa

maximum_backlogs

minimum_10th

minimum_12th

minimum_diploma

allowed_year

gender_requirement
```

---

## Company Allowed Branches

```
id

company_id

branch
```

---

## Company Allowed Locations

```
id

company_id

location_zone
```

Examples

```
Western

Central

Harbour

Navi Mumbai
```

---

## Applications

```
application_id

student_id

company_id

status

applied_on
```

---

## Offers

```
offer_id

student_id

company_id

package_lpa

offer_date

accepted
```

---

## Placement Results

```
result_id

student_id

company_id

round_1

round_2

technical

hr

final_result
```

---

## Company Visits

```
visit_id

company_id

visit_date

venue

description

notification_sent
```

---

## Notifications

```
notification_id

title

message

company_id

created_by

created_at
```

---

## Notification Recipients

```
id

notification_id

student_id

is_read
```

---

# 8. Database Features

The project demonstrates:

- Primary Keys
- Foreign Keys
- Check Constraints
- Unique Constraints
- Composite Keys
- Indexes
- Views
- Stored Functions
- Stored Procedures
- Triggers
- Transactions

---

# 9. PostgreSQL Features

## Views

```
eligible_students

placement_statistics

company_statistics
```

---

## Functions

```
check_student_eligibility()

apply_student()

get_company_statistics()
```

---

## Triggers

```
Offer Rule Trigger

Application Log Trigger

Notification Trigger
```

---

## Indexes

```
student_id

company_id

roll_no

branch

passout_year

package_lpa
```

---

# 10. Project Structure

```
project_propel

│

├── frontend
│
│   ├── public
│   ├── src
│   │
│   ├── assets
│   │
│   ├── components
│   │   ├── common
│   │   ├── student
│   │   ├── coordinator
│   │   └── charts
│   │
│   ├── layouts
│   │
│   ├── pages
│   │   ├── auth
│   │   ├── student
│   │   ├── coordinator
│   │   └── shared
│   │
│   ├── services
│   ├── hooks
│   ├── context
│   ├── routes
│   ├── utils
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── backend
│
│   ├── src
│   │
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── repositories
│   ├── routes
│   ├── services
│   ├── validations
│   ├── constants
│   ├── utils
│   │
│   ├── app.js
│   └── server.js
│
├── database
│
│   ├── schema.sql
│   ├── seed.sql
│   ├── constraints.sql
│   ├── indexes.sql
│   ├── views.sql
│   ├── functions.sql
│   ├── procedures.sql
│   ├── triggers.sql
│   └── sample_queries.sql
│
├── docs
│
│   ├── PRD.md
│   ├── API.md
│   ├── DatabaseDesign.md
│   ├── ERD.png
│   ├── RelationalSchema.pdf
│   └── ProjectReport.docx
│
├── .env
├── .gitignore
├── README.md
└── package.json
```

---

# 11. Development Roadmap

## Phase 1 — Project Initialization

- Install PostgreSQL
- Install Node.js
- Install React
- Initialize Git
- Configure Backend
- Connect PostgreSQL

Deliverable

- Working project structure

---

## Phase 2 — Database Design

- ER Diagram
- Relational Schema
- Normalization (3NF)
- Create Database
- Foreign Keys
- Constraints

Deliverable

- Fully normalized PostgreSQL schema

---

## Phase 3 — Authentication

- Student Login
- Coordinator Login
- JWT
- Password Hashing
- Role Middleware

Deliverable

- Secure Authentication System

---

## Phase 4 — Student Module

- Profile
- Semester CGPA
- Resume
- Edit Profile

Deliverable

- Student Dashboard

---

## Phase 5 — Company Module

- Company CRUD
- HR Details
- Eligibility Criteria
- Company Visits

Deliverable

- Company Management

---

## Phase 6 — Eligibility Engine

Develop

```
check_student_eligibility()
```

Checks

- Branch
- CGPA
- Backlogs
- Division
- Passout Year
- Location Zone

Deliverable

- Automatic Eligibility System

---

## Phase 7 — Applications

Workflow

```
Student

↓

Eligibility Check

↓

Application

↓

Coordinator Dashboard
```

Deliverable

- Application Management

---

## Phase 8 — Offer Management

Implement

- Offers Table
- Offer Trigger
- ₹5 LPA Rule

Deliverable

- Offer Restriction System

---

## Phase 9 — Placement Results

- Upload Results
- Track Rounds
- Final Selection

Deliverable

- Placement Tracking

---

## Phase 10 — Notifications

- Company Visits
- Registration
- Results
- Announcements

Deliverable

- Notification Center

---

## Phase 11 — Analytics Dashboard

Charts

- Company-wise Placements
- Branch-wise Placements
- Highest Package
- Average Package
- Placement Percentage
- Applications
- Offers

Deliverable

- Placement Analytics Dashboard

---

## Phase 12 — Testing

- Authentication
- CRUD
- Database Constraints
- Triggers
- Eligibility
- Analytics

---

## Phase 13 — Deployment

Frontend

- Vercel

Backend

- Render

Database

- Supabase PostgreSQL

---

# 12. REST API Structure

```
/api/auth

/api/students

/api/companies

/api/company-criteria

/api/applications

/api/offers

/api/results

/api/notifications

/api/company-visits

/api/analytics
```

---

# 13. Git Branch Strategy

```
main

develop

feature/auth

feature/student

feature/company

feature/eligibility

feature/applications

feature/offers

feature/analytics

feature/notifications
```

---

# 14. Future Scope

- Resume Parsing using AI
- Bulk Excel Import
- Email Notifications
- Placement Prediction
- Alumni Referral Portal
- Student Skill Analytics
- Resume Scoring
- Multi-College Support

---

# 15. Expected Learning Outcomes

- PostgreSQL Database Design
- Database Normalization
- Relational Modeling
- SQL Query Optimization
- Triggers & Stored Functions
- REST API Development
- Authentication & Authorization
- Dashboard Analytics
- Full-Stack Development
- Real-world Placement Management Workflow