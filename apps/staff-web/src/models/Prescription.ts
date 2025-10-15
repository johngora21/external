export interface PrescriptionSupplement {
  id: string;
  name: string;
  quantity: number;
  price: number;
  pv: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  consultantId: string;
  consultantName: string;
  supplements: PrescriptionSupplement[];
  totalPrice: number;
  totalPV: number;
  status: 'pending' | 'fulfilled' | 'cancelled';
  prescriptionDate: Date;
  notes?: string;
}

export interface PrescriptionFilters {
  searchTerm?: string;
  status?: string;
  consultantId?: string;
  patientId?: string;
}

export interface PrescriptionStats {
  pending: number;
  fulfilled: number;
  totalRevenue: number;
  totalPV: number;
}
