# Database Design Document — Project Propel

## 1. Schema Overview & Normalization

Project Propel database is normalized up to **Third Normal Form (3NF)**:
1. **1NF (First Normal Form)**: All column values are atomic (e.g. multi-valued skills are handled via array/junction, student branch/locations are separated into lookup tables).
2. **2NF (Second Normal Form)**: All non-key attributes are fully dependent on the primary keys.
3. **3NF (Third Normal Form)**: No transitive dependencies exist. Company criteria, applications, offers, and semester CGPAs reside in independent entity tables linked by foreign keys.

---

## 2. Table Dependencies & ER Relational Mapping

```
users (user_id PK)
 └── students (student_id PK, user_id FK)
      ├── student_semester_cgpa (student_id FK)
      ├── applications (student_id FK, company_id FK)
      ├── offers (student_id FK, company_id FK)
      ├── placement_results (student_id FK, company_id FK)
      └── notification_recipients (student_id FK, notification_id FK)

companies (company_id PK)
 ├── company_criteria (company_id FK)
 ├── company_allowed_branches (company_id FK)
 ├── company_allowed_locations (company_id FK)
 ├── company_visits (company_id FK)
 ├── applications (company_id FK)
 ├── offers (company_id FK)
 └── notifications (company_id FK)
```

---

## 3. Business Rule Enforcement in PostgreSQL

- **Rule 5 (Offer Upgrade Restriction)**: Enforced via trigger `trg_enforce_offer_rule` on table `applications`.
- **Automatic Notification Dispatch**: Enforced via trigger `trg_notify_company_visit` on `company_visits`.
- **Eligibility Engine**: Calculated using stored function `check_student_eligibility(student_id, company_id)`.
