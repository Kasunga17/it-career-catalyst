# Implementation Plan - IT Career Placement System (Frontend Prototype)

Building a secure, streamlined web application for managing IT internship and field study applications.

**IMPORTANT NOTE:** As per session constraints, this implementation will be a **Frontend-only React prototype**. While the user requested PHP/MySQL, the current environment is set up for a React/Vite/Tailwind project. I will build the functional UI and use `localStorage` for data persistence to simulate the system's behavior without a backend.

## Scope Summary
- **Multi-tier User System:** Public Visitor, Student, Corporate/Organization, and Admin.
- **Academic Referee Tracking:** Automated questionnaire simulation for lecturers.
- **Corporate Auditing:** Verification workflow for organization documents.
- **Unified Design System:** Implementing "SoftCare" tokens (Blue, Aloe Green, Mustard, Dark Slate).
- **Client-side Persistence:** Using `localStorage` to mock database interactions.

## Non-Goals
- Real PHP/MySQL backend implementation (not supported in this session).
- Real email sending (will be simulated via UI notifications).
- Actual file uploads to a server (will be simulated with local state).

## Assumptions & Open Questions
- **Assumption:** The user accepts a modern React frontend built with the specified design tokens as a functional representation of their requirements.
- **Open Question:** Should we use a routing library? (Yes, `react-router-dom` will be used).

## Affected Areas
- **Frontend (React):** All views, dashboards, and forms.
- **Styling (Tailwind):** Customizing the theme to match SoftCare tokens.
- **State Management:** Local storage for persisting "mock" database data.

## Ordered Phases

### Phase 1: Foundation & Design Tokens
- Set up `react-router-dom` for navigation.
- Configure `tailwind.config.js` (or `index.css` variables) with SoftCare colors.
- Create shared layout components (Header, Footer, Dashboard Sidebar).
- **Owner:** `frontend_engineer`

### Phase 2: Authentication & Registration
- Build the multi-tier registration form (Student vs Company).
- Create the unified login portal.
- Implement client-side session management (simulated login status).
- **Owner:** `frontend_engineer`

### Phase 3: Student & Company Portals
- **Student Dashboard:** Application tracking, Referee status.
- **Company Dashboard:** Post opportunity form, applicant management.
- **Placement Aggregator:** Public-facing job board with search/filter.
- **Owner:** `frontend_engineer`

### Phase 4: Admin Desk & Referee Logic
- **Admin Dashboard:** Statistics, User management, Organization auditing.
- **Referee Simulation:** A special route for lecturers to "verify" students using a token.
- **Owner:** `frontend_engineer`

### Phase 5: Final Polishing & Integration
- Wire up the notification bell logic.
- Ensure all "SoftCare" design tokens are applied correctly across all views.
- Final CSS/UI tweaks.
- **Owner:** `quick_fix_engineer`

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Build the core routing, design system, and all functional portals.
2. quick_fix_engineer — Polish UI, fix any layout issues, and ensure design token consistency.

**Per-agent instructions:**
### 1. frontend_engineer
- **Phases:** 1, 2, 3, 4
- **Scope:** Create a complete multi-user React app. Use `react-router-dom` (run `bun add react-router-dom`). Use `localStorage` to store 'users', 'organizations', 'applications', and 'opportunities'.
- **Files:** `src/App.tsx`, `src/components/*`, `src/pages/*`, `src/index.css`.
- **Depends on:** none
- **Acceptance criteria:** Users can register as student/company, login, companies can post jobs, students can apply, admin can approve organizations.

### 2. quick_fix_engineer
- **Phases:** 5
- **Scope:** Final UI/UX refinements. Ensure the color palette (#0091DF, #008543, etc.) is perfectly applied. Adjust margins/paddings for a professional corporate look.
- **Files:** `src/index.css`, various component files.
- **Depends on:** frontend_engineer
- **Acceptance criteria:** High-fidelity UI matching the "SoftCare" visual standard.
