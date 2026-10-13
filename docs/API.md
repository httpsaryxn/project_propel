# REST API Specification — Project Propel

## Base URL
`/api`

## Authentication & Authorization
All authenticated routes require a Bearer token in the request header:
`Authorization: Bearer <JWT_TOKEN>`

---

## 🔑 Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a student account |
| POST | `/api/auth/login` | Public | Authenticate user & return JWT |
| GET | `/api/auth/me` | Authenticated | Get current logged in user details |

---

## 👨‍🎓 Student Management (`/api/students`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/students/profile` | Student | Get current student profile & CGPA |
| PUT | `/api/students/profile` | Student | Update student profile details |
| POST | `/api/students/cgpa` | Student | Add semester SGPA / CGPA record |
| GET | `/api/students` | Coordinator | List all students with search & filters |

---

## 🏢 Company Management (`/api/companies`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/companies` | Authenticated | List all recruitment drives |
| GET | `/api/companies/:id` | Authenticated | Get single company details & criteria |
| POST | `/api/companies` | Coordinator | Add new hiring company |
| PUT | `/api/companies/:id` | Coordinator | Update company & criteria |
| DELETE | `/api/companies/:id` | Coordinator | Remove company record |

---

## 📝 Applications & Eligibility (`/api/applications`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/applications/eligible` | Student | Get companies student is eligible for |
| POST | `/api/applications/apply` | Student | Apply for an eligible company |
| GET | `/api/applications/my` | Student | View student's applied status |
| GET | `/api/applications/company/:id` | Coordinator | List applications for a specific company |
| PATCH | `/api/applications/:id/status` | Coordinator | Update application status |

---

## 📊 Analytics (`/api/analytics`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/analytics/overall` | Coordinator | Placement rate, avg & max packages |
| GET | `/api/analytics/company` | Coordinator | Applicants & selections per company |
| GET | `/api/analytics/branch` | Coordinator | Placement stats grouped by branch |
