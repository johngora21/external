# Eternal Branch Staff Portal

The staff portal for the Eternal Branch Clinic Management Software System, designed for receptionists, doctors, and pharmacy staff.

## Features

### Role-Based Access
- **Receptionists**: Patient management, appointment scheduling
- **Doctors**: Medical consultations, patient records, diagnosis tracking
- **Pharmacy Staff**: Supplement inventory, sales processing, PV tracking

### Key Functionality
- **Dashboard**: Role-specific overview with quick actions and recent activity
- **Patient Management**: Complete patient records with medical history and contact information
- **Consultations**: Medical consultation tracking with symptoms, diagnosis, and prescriptions
- **Supplements**: Inventory management with stock alerts and product information
- **Sales**: Supplement sales processing with PV (Point Value) tracking

### Authentication
- Secure login system with role-based access control
- Demo credentials provided for testing

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
cd apps/staff-web
npm install
```

### Development
```bash
npm run dev
```

The application will be available at `http://localhost:3001`

### Demo Credentials
- **Receptionist**: `receptionist@eternalbranch.com` / `password123`
- **Doctor**: `doctor@eternalbranch.com` / `password123`
- **Pharmacy**: `pharmacy@eternalbranch.com` / `password123`

## Technology Stack
- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for build tooling

## Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth)
├── pages/             # Main application pages
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Patients.tsx
│   ├── Consultations.tsx
│   ├── Supplements.tsx
│   └── Sales.tsx
└── shared/            # Shared types and utilities
```

## Features by Role

### Receptionist Dashboard
- Today's appointments count
- New patients registered
- Quick access to patient registration
- Daily schedule overview

### Doctor Dashboard  
- Pending consultations
- Patient waiting list
- Medical record access
- Consultation management

### Pharmacy Dashboard
- Daily sales revenue
- Items sold tracking
- PV earned monitoring
- Inventory management

## Mock Data
The application includes comprehensive mock data for:
- Patient records with medical history
- Consultation records with diagnosis and prescriptions
- Supplement inventory with stock levels
- Sales transactions with PV tracking

## UI Design
Following the user's preferences:
- Compact mobile-first design
- Green color scheme (#008000)
- Small font sizes (14px-16px)
- Tight padding and spacing
- No card components
- Clean, professional interface
