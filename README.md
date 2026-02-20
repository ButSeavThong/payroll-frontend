# HR Payroll Management System

A comprehensive full-stack HR and Payroll Management System built with Next.js 16, Redux Toolkit, RTK Query, and Tailwind CSS. This system manages employee accounts, profiles, attendance tracking, and payroll generation with role-based access control.

## Features

### User Management
- User account creation with role-based access (ADMIN/EMPLOYEE)
- Secure authentication with JWT tokens
- User profile management with DOB and gender information

### Employee Management
- Create and manage employee profiles
- Link employees to user accounts
- Track employee information (department, position, salary, hire date)
- Monitor employee status (active/inactive)

### Attendance Tracking
- Daily check-in and check-out functionality
- Automatic overtime calculation
- Attendance history and records
- Admin view for all employee attendance

### Payroll Management
- Monthly payroll generation for all or specific employees
- Salary calculation with overtime pay
- Tax deduction tracking
- Payment status management (GENERATED/PAID)
- Employee-specific payroll records with breakdown

### Dashboard
- Admin dashboard with key metrics (total employees, attendance, pending payments)
- Employee dashboard with personal metrics (check-in status, salary, overtime)

### User Interface
- Responsive design for mobile and desktop
- Collapsible sidebar navigation
- Role-based menu items
- Modal forms for data entry
- Loading states and error handling
- Toast notifications for feedback

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form + Zod
- **Notifications**: Sonner
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone [<repository-url>](https://github.com/ButSeavThong/rayroll-frontend.git)
cd hr-payroll-system
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and update the API URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

### Running the Application

Development mode:
```bash
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3000`

Production build:
```bash
npm run build
npm run start
```

## Project Structure

```
/app
├── middleware.ts              # Route protection and authentication
├── layout.tsx                 # Root layout with Redux provider
├── page.tsx                   # Home page (redirects to dashboard)
├── (auth)/
│   └── login/page.tsx         # Login page
└── (dashboard)/
    ├── layout.tsx             # Dashboard layout with sidebar
    ├── dashboard/page.tsx      # Dashboard summary
    ├── users/page.tsx          # User management (ADMIN)
    ├── employees/page.tsx      # Employee management
    ├── attendance/page.tsx      # Attendance tracking
    └── payroll/page.tsx        # Payroll management

/src
├── store.ts                   # Redux store configuration
├── provider.tsx               # Redux provider wrapper
├── hooks.ts                   # Custom Redux hooks
├── lib/utils.ts               # Utility functions
├── components/                # Shared React components
│   ├── sidebar.tsx
│   ├── summary-card.tsx
│   ├── status-badge.tsx
│   ├── form-field.tsx
│   ├── loading-table.tsx
│   ├── create-user-modal.tsx
│   ├── create-employee-modal.tsx
│   └── generate-payroll-modal.tsx
└── feature/                   # Redux feature slices
    ├── auth/
    │   ├── authSlice.ts
    │   └── authApi.ts
    ├── user/
    │   └── userApi.ts
    ├── employee/
    │   └── employeeApi.ts
    ├── attendance/
    │   └── attendanceApi.ts
    └── payroll/
        └── payrollApi.ts

/components/ui/               # shadcn/ui components
```

## API Integration

The application communicates with a backend API at the configured `NEXT_PUBLIC_API_URL`. All endpoints are prefixed with `/api/v1/`.

### Authentication Flow

1. User logs in with username and password
2. Backend returns JWT token and user role
3. Token is stored in Redux state and cookie
4. Middleware protects dashboard routes
5. All API requests include Bearer token in Authorization header
6. 401 responses trigger logout and redirect to login

### Key API Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /users` - List all users (ADMIN)
- `POST /users` - Create new user (ADMIN)
- `GET /employees` - List all employees
- `GET /employees/me` - Get current user's employee profile
- `POST /employees` - Create employee profile (ADMIN)
- `PUT /employees/{id}` - Update employee profile (ADMIN)
- `GET /attendance/my` - Get current user's attendance
- `GET /attendance/all` - Get all attendance records (ADMIN)
- `POST /attendance/check-in` - Check in
- `POST /attendance/check-out` - Check out
- `GET /payroll/my` - Get current user's payroll
- `GET /payroll/all` - Get all payroll records (ADMIN)
- `POST /payroll/generate` - Generate payroll (ADMIN)
- `PATCH /payroll/{id}/pay` - Mark payroll as paid (ADMIN)

## Demo Credentials

For testing purposes, use these credentials:

**Admin**
- Username: `admin`
- Password: `admin123`

**Employee**
- Username: `employee`
- Password: `emp123`

## Date and Time Formats

- **Display format**: "Jan 15, 2024" (using Intl.DateTimeFormat)
- **API format**: "yyyy-MM-dd" (ISO format for dates)
- **Month format**: "yyyy-MM" (for payroll periods)
- **Time format**: "HH:mm" (24-hour format for check-in/out)

## Features in Detail

### Onboarding Process
1. Create User Account (Users tab)
2. Copy User ID
3. Create Employee Profile (Employees tab, paste User ID)
4. Set department, position, and salary
5. Employee can now use check-in/out
6. Generate payroll from Payroll tab

### Overtime Calculation
- Standard workday: 8 hours
- Hours beyond 8 hours are marked as overtime
- Overtime highlighted in amber in tables
- Overtime pay calculated separately in payroll

### Role-Based Features

**Admin Features:**
- User management (create accounts)
- Employee directory (manage profiles)
- Attendance oversight (view all records)
- Payroll generation and payment tracking
- Dashboard with company metrics

**Employee Features:**
- View own profile
- Daily check-in/check-out
- View own attendance history
- View own payroll records with breakdown

## Security Features

- JWT-based authentication
- Protected route middleware
- Secure token storage (Redux + HTTP-only cookie)
- 401 response handling (auto logout)
- Input validation with Zod schemas
- Form field error messages

## Performance Optimization

- RTK Query caching for API responses
- Skeleton loaders during data fetching
- Responsive sidebar (collapses on mobile)
- Optimized table rendering with horizontal scroll
- Lazy loading of components

## Troubleshooting

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend server is running
- Inspect Network tab in browser DevTools

### Login Issues
- Ensure username and password are correct
- Check backend is responding to login endpoint
- Verify token is being stored in Redux state

### Missing Data
- Check RTK Query cache tags are being invalidated after mutations
- Verify API endpoints are returning correct data format
- Check browser console for network errors

## Development Notes

- The middleware protects all dashboard routes
- Redux Provider must wrap all components that need state
- RTK Query handles both caching and mutation side effects
- Form validation happens on submit with Zod schemas
- All API errors are caught and shown as toast notifications
- Mobile navigation uses a hamburger menu with overlay

## Future Enhancements

- Export payroll to PDF/Excel
- Email notifications for payroll
- Multi-currency support
- Advanced reporting and analytics
- Bulk employee import
- Attendance scheduling and leave management
- Performance review integration
- Document upload and storage
