# Dr. Mitchell — Senior Oncologist & Cancer Specialist Website

A modern, professional, and fully responsive website for an oncologist doctor's practice. It includes a public-facing landing page, an appointment booking system, and a secure admin dashboard for managing all website content and patient appointments.

**Live Preview:** https://id-preview--e4c5db4b-a715-495d-995a-21d1740ffc30.lovable.app

---

## Table of Contents

1. [Why It Was Made](#why-it-was-made)
2. [What Has Been Done](#what-has-been-done)
3. [Technology Stack](#technology-stack)
4. [Project Architecture](#project-architecture)
5. [How to Use the Website](#how-to-use-the-website)
6. [Admin Dashboard Guide](#admin-dashboard-guide)
7. [Local Development](#local-development)
8. [Deployment](#deployment)
9. [Database Schema](#database-schema)
10. [Default Admin Credentials](#default-admin-credentials)

---

## Why It Was Made

This application was built to give Dr. Mitchell a complete digital presence for his oncology practice. The goal was to create a trustworthy, accessible, and easy-to-manage website that:

- Helps patients learn about the doctor's expertise and services.
- Shows where and when the doctor visits different hospitals/clinics.
- Allows patients to book appointments online.
- Gives the doctor (or clinic staff) a private admin dashboard to update content, manage chambers, services, and review appointment requests without needing technical knowledge.

The project follows modern web standards, is mobile-first, and uses a clean medical color palette to convey professionalism and trust.

---

## What Has Been Done

### Public Website (Landing Page)

The homepage is a single-page application with smooth scroll navigation and animated sections:

1. **Sticky Glass Navbar**
   - Logo + doctor name
   - Navigation links: Home, About, Services, Chambers, Appointment, Blog, FAQ, Contact
   - Mobile hamburger menu
   - Dark mode toggle (Sun/Moon icon with localStorage persistence)

2. **Hero Section**
   - Headline and subtext (editable from admin)
   - Call-to-action buttons
   - Floating stats: 15+ years experience, 5000+ patients treated
   - Framer Motion entrance animations

3. **About Section**
   - Doctor name, subtitle/specialization, description
   - Education and certifications
   - Professional timeline/story

4. **Services Section**
   - 6 service cards with icons, titles, and descriptions
   - Examples: Cancer Diagnosis & Screening, Chemotherapy, Radiation Therapy, Immunotherapy, Surgical Oncology Consultation, Palliative Care

5. **Chamber Schedule Section**
   - Cards showing multiple hospital/clinic locations
   - Each card displays: name, address, visiting days, time, phone
   - Useful because the doctor visits multiple chambers in a day/week

6. **Appointment Section**
   - Patient booking form with validation
   - Fields: name, email, phone, preferred date, service selection, message
   - Date picker and dropdown selects
   - Success toast notification after submission
   - Submissions are saved to the database

7. **Blog Section**
   - Grid of health/cancer awareness articles
   - Placeholder for future blog posts

8. **FAQ Section**
   - Accordion-style frequently asked questions
   - Smooth expand/collapse animations

9. **Contact Section**
   - Phone, email, address, working hours
   - Google Maps embed
   - Editable from admin

10. **Footer**
    - Newsletter signup
    - Quick links
    - Social links placeholder
    - Copyright

### Admin Dashboard

A protected route at `/admin/dashboard` where authenticated admins can:

- **Appointments Tab**: View, update status, delete patient appointments
  - Statuses: Pending, Confirmed, Completed, Cancelled
  - View full appointment details in a modal
- **Chambers Tab**: Add, edit, remove chamber/hospital details
- **Services Tab**: Add, edit, remove services
- **About Tab**: Edit doctor name, subtitle, description, education, certifications, hero headline, hero subtext
- **Contact Tab**: Edit phone, email, address, working hours

### Backend & Authentication

- Lovable Cloud backend (Supabase) for database and authentication
- Row Level Security (RLS) policies for secure data access
- Admin role system using `user_roles` table and `has_role` security definer function
- Public read access for website content
- Admin-only write access for protected data
- Seeded default admin account
- Edge function to seed admin user, roles, and initial data

---

## Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with functional components and hooks |
| **TypeScript** | Type-safe development |
| **Vite 5** | Fast build tool and dev server |
| **Tailwind CSS v3** | Utility-first styling |
| **shadcn/ui** | Pre-built accessible UI components (Button, Input, Dialog, Select, Toast, etc.) |
| **Framer Motion** | Page load and scroll reveal animations |
| **Lucide React** | Icon library |
| **React Router v6** | Client-side routing |
| **React Hook Form** | Form handling and validation |
| **Zod** | Schema validation |
| **date-fns** | Date formatting |
| **next-themes** | Dark mode management |
| **TanStack Query** | Server state management |
| **Sonner + Radix Toast** | Toast notifications |

### Backend

| Technology | Purpose |
|------------|---------|
| **Lovable Cloud** | Backend-as-a-service (database, auth, edge functions) |
| **Supabase Client** | Database queries and authentication |
| **Row Level Security (RLS)** | Fine-grained access control |
| **Edge Functions** | Server-side logic (admin/user seeding) |

### Testing & Tooling

| Technology | Purpose |
|------------|---------|
| **Vitest** | Unit testing |
| **Testing Library** | React component testing |
| **ESLint** | Linting |
| **Playwright** | End-to-end browser testing |

---

## Project Architecture

```
├── public/                 # Static assets (placeholder.svg, robots.txt)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── admin/          # Admin-only components (AppointmentsTab)
│   │   ├── sections/       # Homepage sections
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # Custom React hooks (useAuth, use-toast, use-mobile)
│   ├── integrations/
│   │   └── supabase/       # Supabase client and generated types
│   ├── lib/                # Utility functions
│   ├── pages/              # Route-level pages (Index, AdminLogin, AdminDashboard, NotFound)
│   ├── App.tsx             # Main app with routes
│   ├── index.css           # Global styles and Tailwind directives
│   └── main.tsx            # Entry point
├── supabase/
│   ├── config.toml         # Supabase project config
│   └── functions/          # Edge functions
│       └── seed-admin/     # Seeds admin user and initial data
├── index.html              # HTML entry
├── tailwind.config.ts      # Tailwind theme config
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies and scripts
```

---

## How to Use the Website

### For Patients (Public Website)

1. **Visit the homepage** at `/`.
2. **Explore sections** using the navbar or by scrolling.
3. **View services** to understand available treatments.
4. **Check the Chambers section** to find visiting days, times, and locations.
5. **Book an appointment**:
   - Scroll to the Appointment section or click "Appointment" in the navbar.
   - Fill in your name, email, phone, preferred date, service, and message.
   - Click "Book Appointment".
   - A success toast will confirm your submission.
6. **Toggle dark mode** using the Sun/Moon icon in the navbar.
7. **Contact the clinic** using details in the Contact/Footer section.

### For the Admin

1. **Go to `/admin`**.
2. **Sign in** with the admin credentials.
3. You will be redirected to `/admin/dashboard`.
4. Use the sidebar or mobile tabs to switch between:
   - **Appointments**: Review and manage patient bookings.
   - **Chambers**: Update hospital/clinic details.
   - **Services**: Update service cards.
   - **About**: Update doctor profile and hero text.
   - **Contact**: Update contact information.
5. Click **"Save Changes"** after editing any tab.
6. Changes are saved to the database and reflected immediately on the public website.
7. Click **"Logout"** when finished.

---

## Admin Dashboard Guide

### Appointments Tab

- View all submitted appointments in a list.
- Each appointment shows the patient name, service, preferred date, and status.
- Use the dropdown to change status: Pending → Confirmed → Completed, or Cancelled.
- Click the **Eye** icon to view full details (email, phone, message, submitted time).
- Click the **X** icon to delete an appointment.

### Chambers Tab

- Edit existing chamber cards inline.
- Add new chambers with the "Add Chamber" button.
- Remove chambers with the trash icon.
- Fields: Hospital/Clinic Name, Address, Days, Time, Phone.

### Services Tab

- Edit existing service cards.
- Add new services with the "Add Service" button.
- Remove services with the trash icon.
- Fields: Service Title, Icon Name (Lucide icon name), Description.

### About Tab

- Edit Doctor Name, Subtitle/Specialization, Description, Education, Certifications.
- Also edit Hero Headline and Hero Subtext.

### Contact Tab

- Edit Phone, Email, Address, and Working Hours.

---

## Local Development

### Prerequisites

- Node.js (LTS recommended)
- npm or bun

### Setup Steps

1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   ```

4. **Open the app** in your browser at the URL shown (usually `http://localhost:8080`).

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run Vitest tests |
| `npm run lint` | Run ESLint |

---

## Deployment

This project is built with Lovable. To publish:

1. Open your project in Lovable.
2. Click **Share → Publish**.
3. Your website will be deployed to a public URL.

For custom domains, go to **Project → Settings → Domains** and connect your domain.

---

## Database Schema

### Tables

| Table | Purpose | Access |
|-------|---------|--------|
| `appointments` | Stores patient booking requests | Public INSERT, Admin full access |
| `chambers` | Stores hospital/clinic locations and schedules | Public SELECT, Admin full access |
| `services` | Stores oncology services | Public SELECT, Admin full access |
| `site_content` | Stores editable content (about, contact, hero) | Public SELECT, Admin full access |
| `user_roles` | Stores user roles (admin, user) | Auth-only, read via security definer |

### Security

- RLS is enabled on all tables.
- Public users can read website content and submit appointments.
- Only authenticated users with the `admin` role can modify content.
- The `has_role` function uses `SECURITY DEFINER` to avoid recursive RLS checks.

---

## Default Admin Credentials

> **Email:** `admin@clinic.com`  
> **Password:** `admin123456`

These credentials are seeded by the `supabase/functions/seed-admin` edge function. For production, change the admin password after first login.

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Primary | Deep Navy Blue `#0A2342` | Headings, trust signals, navbar |
| Accent | Warm Teal `#2A9D8F` | Buttons, highlights, links |
| Background | Soft Off-White `#F8F9FA` | Page background |
| Text | Charcoal `#2D3748` | Body text |

---

## Notes

- The project uses semantic design tokens through Tailwind CSS and shadcn/ui. Avoid hardcoding colors in components.
- Dark mode is fully supported and persists across sessions.
- The website is fully mobile responsive.
- Sign-ups are disabled; only the seeded admin can sign in.
- Email notifications for appointments were planned but require a third-party email service (e.g., Resend) and API key.

---

Built with ❤️ using Lovable, React, Tailwind CSS, and Lovable Cloud.
