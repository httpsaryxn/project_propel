# Project Propel

## Placement Analytics & Recruitment Management System (PARMS)

**Project Type:** DBMS Mini Project  
**Primary Focus:** Database Design, Normalization (3NF), PostgreSQL Relations, Triggers, Functions, Views & Analytics

---

## 🚀 Overview

Project Propel is a centralized Placement Analytics & Recruitment Management System designed for educational institutions to automate student profile management, company criteria matching, application tracking, placement result publishing, notification dispatch, and real-time recruitment analytics.

### Key Database Highlights:
- **Normalized Schema (3NF)**: Structured tables eliminating redundancy.
- **Constraints & Indexes**: Strong referential integrity and performance optimizations.
- **PostgreSQL Triggers**: Automated enforcement of business rules (e.g. ₹5 LPA rule for offer upgrades).
- **Stored Functions & Views**: Pre-compiled database routines for instant eligibility checking and analytic reports.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite, TailwindCSS, Chart.js |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL (Supabase / Local) |
| **Authentication** | JWT, bcrypt |
| **Hosting (Target)** | Vercel (Frontend), Render (Backend), Supabase (Database) |

---

## 📁 Project Structure

```
project_propel
├── frontend/        # React + Vite UI application
├── backend/         # Node.js + Express REST API server
├── database/        # PostgreSQL SQL scripts (schema, views, triggers, functions, seed data)
├── docs/            # Architecture, API & Database documentation
├── .env             # Environment variables
└── package.json     # Workspace management scripts
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+) or Supabase account

### Installation

1. Install all dependencies for both frontend and backend:
   ```bash
   npm run install:all
   ```

2. Configure environment variables:
   - Edit `.env` or create `backend/.env` with your PostgreSQL credentials.

3. Database Setup:
   - Execute SQL scripts in the `database/` folder in order:
     1. `schema.sql`
     2. `constraints.sql`
     3. `indexes.sql`
     4. `views.sql`
     5. `functions.sql`
     6. `procedures.sql`
     7. `triggers.sql`
     8. `seed.sql`

4. Run Development Servers:
   - Backend: `npm run dev:backend`
   - Frontend: `npm run dev:frontend`
