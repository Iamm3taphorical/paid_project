# Freelance Pro - Project Management System

A production-grade freelance project management system built with Next.js 14, TypeScript, Tailwind CSS, and shadcn UI. This project follows a strict ER database schema for CSE370.

## 🚀 Features

### Core Features
- **Job Management** - Track projects, filter by status, manage deadlines
- **Payment Tracking** - Monitor payment status, due dates, and history
- **Client Management** - Customer directory with contact information
- **Service Provider** - Track freelancer specializations and rates

### 9 Advanced Analytics Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Payment Due Alerts** | Detects unpaid payments due within 7 days or overdue |
| 2 | **Monthly/Yearly Income** | Aggregates paid payments by month |
| 3 | **Client Reliability Score** | Calculates on-time payment percentage |
| 4 | **Avg Completion Time** | Measures days between job start and payment |
| 5 | **Service Demand** | Counts service frequency from Requires table |
| 6 | **Revenue by Service** | Sums revenue grouped by service type |
| 7 | **High-Value Detection** | Identifies jobs above average value |
| 8 | **Review Sentiment** | Keyword-based positive/neutral/negative classification |
| 9 | **Workload Status** | Counts ongoing, completed, and pending jobs |

### UI Components
- **NeonOrbs** - Animated background orbs for landing page
- **TubesCursor** - WebGL cursor effect for hero sections
- **shadcn UI** - Card, Button, Badge components

## 🗃️ Database Schema

The system follows a strict ER diagram with:

**Entities:**
- `User` (id, email, user_type, name, password)
- `Customer` (id, address, phone) - specialization of User
- `ServiceProvider` (id, specialization, hourly_rate) - specialization of User
- `Job` (J_id, title, description, datetime, status, total_amount)
- `JobLocation` (J_id, location) - multi-valued attribute
- `Service` (S_id, name, description)
- `Payment` (P_id, due_date, method, payment_status, amount, payment_date)
- `Review` (R_id, date, comment)

**Relationships:**
- `Requests` (Customer → Job)
- `Requires` (Job → Service)
- `Offers` (ServiceProvider → Service)
- `Involves` (Job → Payment)
- `Gives` (Customer → Review)
- `ReviewForJob` (Review → Job)

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Charts:** Recharts
- **Icons:** Lucide React
- **Database:** MySQL (schema provided)

## 📦 Installation

```bash
# Clone or navigate to the project
cd paid_project

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🗄️ Database Setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE paid_project"

# Import schema
mysql -u root -p paid_project < sql/schema.sql
```

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (dark mode)
│   ├── page.tsx            # Landing page with NeonOrbs
│   └── dashboard/
│       ├── layout.tsx      # Dashboard sidebar
│       ├── page.tsx        # Main dashboard
│       ├── jobs/           # Feature 7: High-value detection
│       ├── payments/       # Feature 1: Payment alerts
│       ├── clients/        # Feature 3: Reliability scores
│       └── analytics/      # All 9 features with SQL
├── components/
│   └── ui/
│       ├── neon-orbs.tsx   # Animated background
│       ├── tube-cursor.tsx # WebGL cursor
│       ├── card.tsx        # shadcn Card
│       ├── button.tsx      # shadcn Button
│       └── badge.tsx       # shadcn Badge
├── lib/
│   ├── data.ts             # Mock data + analytics functions
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript definitions
└── sql/
    └── schema.sql          # MySQL database schema
```

## 🎓 CSE370 Project

This project demonstrates:
- Normalized database design (3NF)
- Proper use of relationship tables for many-to-many relationships
- SQL queries with JOINs, subqueries, CASE expressions, and aggregation
- React frontend with TypeScript for type safety
- Modern UI/UX with Tailwind CSS and shadcn

## 📝 License

Academic project for CSE370 Database Systems
