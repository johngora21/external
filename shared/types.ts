// Shared types for Eternal Branch Clinic Management System

export type UserRole = 'superadmin' | 'station_admin' | 'receptionist' | 'doctor' | 'pharmacy' | 'member';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  clinicId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string;
  clinicId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Consultation {
  id: string;
  patientId: string;
  doctorId: string;
  clinicId: string;
  date: Date;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes?: string;
  fee: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplement {
  id: string;
  name: string;
  description: string;
  price: number;
  pv: number; // Point Value for referrals
  stock: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sale {
  id: string;
  patientId?: string;
  memberId?: string;
  supplementId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  pv: number;
  clinicId: string;
  staffId: string;
  date: Date;
  notes?: string;
  createdAt: Date;
}

export interface Member {
  id: string;
  userId: string;
  referralCode: string;
  sponsorId?: string;
  totalPv: number;
  currentPv: number;
  rank: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  isActive: boolean;
  joinedAt: Date;
  updatedAt: Date;
}

export interface PvTransaction {
  id: string;
  memberId: string;
  type: 'earned' | 'redeemed' | 'bonus';
  amount: number;
  description: string;
  referenceId?: string; // Sale ID or referral ID
  date: Date;
  createdAt: Date;
}

export interface Report {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  clinicId?: string;
  date: Date;
  data: {
    patientVisits: number;
    totalFees: number;
    supplementSales: number;
    totalPv: number;
    topSupplements: Array<{ supplementId: string; name: string; quantity: number; revenue: number }>;
    staffPerformance: Array<{ staffId: string; name: string; consultations: number; sales: number }>;
  };
  createdAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  clinic?: Clinic;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
