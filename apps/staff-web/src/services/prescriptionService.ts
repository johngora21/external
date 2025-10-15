import { Prescription, PrescriptionFilters, PrescriptionStats } from '../models/Prescription';

// Mock data - this will be replaced with API calls
const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientId: 'p1',
    patientName: 'John Doe',
    consultantId: 'c1',
    consultantName: 'Dr. Michael Chen',
    supplements: [
      { id: 's1', name: 'Multi-Vitamin Complex', quantity: 2, price: 29.99, pv: 15 },
      { id: 's2', name: 'Omega-3 Fish Oil', quantity: 1, price: 39.99, pv: 20 }
    ],
    totalPrice: 99.97,
    totalPV: 50,
    status: 'pending',
    prescriptionDate: new Date('2023-12-15T10:30:00'),
    notes: 'Patient needs immune support and cardiovascular health'
  },
  {
    id: '2',
    patientId: 'p2',
    patientName: 'Jane Smith',
    consultantId: 'c1',
    consultantName: 'Dr. Michael Chen',
    supplements: [
      { id: 's3', name: 'Vitamin D3', quantity: 1, price: 19.99, pv: 10 },
      { id: 's4', name: 'Probiotics Blend', quantity: 1, price: 49.99, pv: 25 }
    ],
    totalPrice: 69.98,
    totalPV: 35,
    status: 'pending',
    prescriptionDate: new Date('2023-12-15T14:15:00'),
    notes: 'Digestive health and bone strength support'
  },
  {
    id: '3',
    patientId: 'p3',
    patientName: 'Robert Johnson',
    consultantId: 'c1',
    consultantName: 'Dr. Michael Chen',
    supplements: [
      { id: 's5', name: 'Collagen Peptides', quantity: 1, price: 59.99, pv: 30 }
    ],
    totalPrice: 59.99,
    totalPV: 30,
    status: 'fulfilled',
    prescriptionDate: new Date('2023-12-14T09:45:00'),
    notes: 'Joint health improvement'
  }
];

class PrescriptionService {
  // Get all prescriptions with optional filters
  async getPrescriptions(filters?: PrescriptionFilters): Promise<Prescription[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filtered = [...mockPrescriptions];
    
    if (filters?.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.patientName.toLowerCase().includes(searchLower) ||
        p.consultantName.toLowerCase().includes(searchLower) ||
        p.supplements.some(s => s.name.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter(p => p.status === filters.status);
    }
    
    if (filters?.consultantId) {
      filtered = filtered.filter(p => p.consultantId === filters.consultantId);
    }
    
    if (filters?.patientId) {
      filtered = filtered.filter(p => p.patientId === filters.patientId);
    }
    
    return filtered;
  }

  // Get prescription by ID
  async getPrescriptionById(id: string): Promise<Prescription | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockPrescriptions.find(p => p.id === id) || null;
  }

  // Update prescription status
  async updatePrescriptionStatus(id: string, status: 'pending' | 'fulfilled' | 'cancelled'): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const prescription = mockPrescriptions.find(p => p.id === id);
    if (prescription) {
      prescription.status = status;
      return true;
    }
    return false;
  }

  // Get prescription statistics
  async getPrescriptionStats(): Promise<PrescriptionStats> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const stats: PrescriptionStats = {
      pending: mockPrescriptions.filter(p => p.status === 'pending').length,
      fulfilled: mockPrescriptions.filter(p => p.status === 'fulfilled').length,
      totalRevenue: mockPrescriptions.reduce((sum, p) => sum + p.totalPrice, 0),
      totalPV: mockPrescriptions.reduce((sum, p) => sum + p.totalPV, 0)
    };
    
    return stats;
  }

  // Create new prescription (for consultants)
  async createPrescription(prescription: Omit<Prescription, 'id'>): Promise<Prescription> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newPrescription: Prescription = {
      ...prescription,
      id: `prescription_${Date.now()}`
    };
    
    mockPrescriptions.push(newPrescription);
    return newPrescription;
  }
}

// Export singleton instance
export const prescriptionService = new PrescriptionService();
