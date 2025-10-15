import { useState } from 'react'
import { Plus } from 'lucide-react'
import AddPatient from '../components/patients/AddPatient'
import PatientForm from '../components/patients/PatientForm'
import PatientList from '../components/patients/PatientList'

interface Visit {
  id: string
  patientId: string
  visitDate: Date
  consultantId: string
  consultantName: string
  visitType: 'consultation' | 'follow_up' | 'emergency' | 'routine'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  prescriptions?: string[]
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  citizenship?: string;
  country?: string;
  region?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string;
  referrerId?: string;
  referrerName?: string;
  referralCode?: string;
  totalPurchases: number;
  totalReferrals: number;
  totalEarnings: number;
  clinicId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Consultant assignment fields
  assignedConsultantId?: string;
  assignedConsultantName?: string;
  consultationStatus?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  // Payment status
  paymentStatus?: 'paid' | 'pending' | 'overdue';
  // Consultation fee
  consultationFee?: number;
  // Visit history
  visits?: Visit[];
}

// Mock patient data with referral system
const mockPatients: Patient[] = [
  {
    id: 'P1703123456789',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0123',
    dateOfBirth: new Date('1985-03-15'),
    gender: 'male',
    weight: 75.5,
    height: 175,
    citizenship: 'American',
    country: 'United States',
    region: 'California',
    address: '123 Main St, Los Angeles',
    emergencyContact: '+1-555-0124',
    medicalHistory: 'Diabetes Type 2, Hypertension',
    allergies: 'Penicillin',
    referrerId: 'patient-456',
    referrerName: 'Sarah Wilson',
    referralCode: 'REF123',
    totalPurchases: 3,
    totalReferrals: 2,
    totalEarnings: 150.00,
    clinicId: 'clinic-1',
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-12-01'),
    assignedConsultantId: 'c1',
    assignedConsultantName: 'Dr. Michael Chen',
    consultationStatus: 'pending',
    paymentStatus: 'pending',
    consultationFee: 150,
    visits: [
      {
        id: 'v1',
        patientId: '1',
        visitDate: new Date('2023-12-01'),
        consultantId: 'c1',
        consultantName: 'Dr. Michael Chen',
        visitType: 'consultation',
        status: 'completed',
        notes: 'Initial consultation for diabetes management'
      },
      {
        id: 'v2',
        patientId: '1',
        visitDate: new Date('2023-12-15'),
        consultantId: 'c1',
        consultantName: 'Dr. Michael Chen',
        visitType: 'follow_up',
        status: 'scheduled',
        notes: 'Follow-up appointment scheduled'
      }
    ]
  },
  {
    id: 'P1703123456790',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@email.com',
    phone: '+1-555-0125',
    dateOfBirth: new Date('1990-07-22'),
    gender: 'female',
    weight: 62.3,
    height: 165,
    citizenship: 'Canadian',
    country: 'Canada',
    region: 'Ontario',
    address: '456 Oak Ave, Toronto',
    emergencyContact: '+1-555-0126',
    medicalHistory: 'Asthma',
    allergies: 'None',
    totalPurchases: 1,
    totalReferrals: 0,
    totalEarnings: 25.00,
    clinicId: 'clinic-1',
    isActive: true,
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2023-11-28'),
    assignedConsultantId: 'c2',
    assignedConsultantName: 'Dr. Sarah Wilson',
    consultationStatus: 'in_progress',
    paymentStatus: 'paid',
    consultationFee: 120,
    visits: [
      {
        id: 'v3',
        patientId: '2',
        visitDate: new Date('2023-12-10'),
        consultantId: 'c2',
        consultantName: 'Dr. Sarah Wilson',
        visitType: 'consultation',
        status: 'in_progress',
        notes: 'Nutrition consultation for asthma management'
      }
    ]
  },
  {
    id: 'P1703123456791',
    firstName: 'Robert',
    lastName: 'Johnson',
    email: 'robert.j@email.com',
    phone: '+1-555-0127',
    dateOfBirth: new Date('1978-11-08'),
    gender: 'male',
    weight: 82.1,
    height: 180,
    citizenship: 'British',
    country: 'United Kingdom',
    region: 'London',
    address: '789 Pine Rd, Westminster',
    emergencyContact: '+1-555-0128',
    medicalHistory: 'Heart condition',
    allergies: 'Shellfish',
    referrerId: 'patient-1',
    referrerName: 'John Doe',
    referralCode: 'REF456',
    totalPurchases: 5,
    totalReferrals: 1,
    totalEarnings: 275.00,
    clinicId: 'clinic-1',
    isActive: true,
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-12-02'),
    assignedConsultantId: 'c4',
    assignedConsultantName: 'Dr. Emily Johnson',
    consultationStatus: 'completed',
    paymentStatus: 'overdue',
    consultationFee: 200
  },
]

function Patients() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedConsultantId, setSelectedConsultantId] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

  const handlePatientAdded = () => {
    // In a real app, this would refresh the patient list from the API
    console.log('New patient added, refreshing list...')
  }

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowViewModal(true)
  }

  const handleAssignConsultant = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowAssignModal(true)
  }

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient)
    setShowEditModal(true)
  }

  const handlePatientUpdated = (updatedPatient: Patient) => {
    setPatients(prevPatients => 
      prevPatients.map(patient => 
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    )
    setShowEditModal(false)
    setEditingPatient(null)
  }

  // Mock consultants data
  const consultants = [
    { id: 'c1', name: 'Dr. Michael Chen', specialty: 'General Health', available: true },
    { id: 'c2', name: 'Dr. Sarah Wilson', specialty: 'Nutrition', available: true },
    { id: 'c3', name: 'Dr. David Rodriguez', specialty: 'Wellness', available: false },
    { id: 'c4', name: 'Dr. Emily Johnson', specialty: 'Preventive Care', available: true }
  ]

  const assignConsultantToPatient = async () => {
    if (!selectedConsultantId || !selectedPatient) return
    
    try {
      // Find the consultant details
      const consultant = consultants.find(c => c.id === selectedConsultantId)
      if (!consultant) return
      
      // Update the patient with consultant assignment
      setPatients(prevPatients => 
        prevPatients.map(patient => 
          patient.id === selectedPatient.id
            ? {
                ...patient,
                assignedConsultantId: consultant.id,
                assignedConsultantName: consultant.name,
                consultationStatus: 'pending'
              }
            : patient
        )
      )
      
      console.log(`Assigned consultant ${consultant.name} to patient ${selectedPatient.firstName} ${selectedPatient.lastName}`)
      
      // Close the modal
      setShowAssignModal(false)
      setSelectedPatient(null)
      setSelectedConsultantId(null)
    } catch (error) {
      console.error('Failed to assign consultant:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">Manage patient records and referral network</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Patient
        </button>
      </div>

      {/* Patient List Component */}
      <PatientList
        patients={patients}
        onViewPatient={handleViewPatient}
        onEditPatient={handleEditPatient}
        onAssignConsultant={handleAssignConsultant}
      />

      {/* Add Patient Modal */}
      {showAddForm && (
        <AddPatient
          onClose={() => setShowAddForm(false)}
          onPatientAdded={handlePatientAdded}
        />
      )}

      {/* Assign Consultant Modal */}
      {showAssignModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Assign Consultant</h2>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">
                  Select a consultant for <strong>{selectedPatient.firstName} {selectedPatient.lastName}</strong>:
                </p>
                
                <div className="space-y-2">
                  {consultants.map((consultant) => (
                    <div
                      key={consultant.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedConsultantId === consultant.id
                          ? 'border-primary bg-primary/5'
                          : consultant.available
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                      }`}
                      onClick={() => consultant.available && setSelectedConsultantId(consultant.id)}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="consultant"
                          value={consultant.id}
                          checked={selectedConsultantId === consultant.id}
                          onChange={() => setSelectedConsultantId(consultant.id)}
                          disabled={!consultant.available}
                          className="mr-3"
                        />
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-semibold text-xs">
                            {consultant.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{consultant.name}</h3>
                          <p className="text-sm text-gray-500">{consultant.specialty}</p>
                        </div>
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full mr-2 ${
                            consultant.available ? 'bg-primary' : 'bg-red-500'
                          }`}></span>
                          <span className={`text-sm ${
                            consultant.available ? 'text-primary' : 'text-red-600'
                          }`}>
                            {consultant.available ? 'Available' : 'Busy'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={assignConsultantToPatient}
                  disabled={!selectedConsultantId}
                  className={`px-3 py-1 text-sm rounded-lg font-medium ${
                    selectedConsultantId
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {showEditModal && editingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Patient: {editingPatient.firstName} {editingPatient.lastName}
                </h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <PatientForm 
                patient={editingPatient}
                isEditMode={true}
                onSave={handlePatientUpdated}
                onCancel={() => setShowEditModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Patient Modal */}
      {showViewModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedPatient.firstName} {selectedPatient.lastName}
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Personal Information</h3>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Name:</span> {selectedPatient.firstName} {selectedPatient.lastName}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Email:</span> {selectedPatient.email || 'Not provided'}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span> {selectedPatient.phone || 'Not provided'}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Gender:</span> {selectedPatient.gender || 'Not specified'}
                    </div>
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Weight:</span> {selectedPatient.weight ? `${selectedPatient.weight} kg` : 'Not provided'}
                                </div>
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Height:</span> {selectedPatient.height ? `${selectedPatient.height} cm` : 'Not provided'}
                                </div>
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">BMI:</span> {selectedPatient.weight && selectedPatient.height ? 
                                    (selectedPatient.weight / ((selectedPatient.height / 100) ** 2)).toFixed(1) : 'Not calculable'}
                                </div>
                              </div>
                            </div>

                            <div>
                              <h3 className="font-semibold text-gray-900 mb-3">Address Information</h3>
                              <div className="space-y-2">
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Citizenship:</span> {selectedPatient.citizenship || 'Not provided'}
                                </div>
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Country:</span> {selectedPatient.country || 'Not provided'}
                                </div>
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Region/City:</span> {selectedPatient.region || 'Not provided'}
                                </div>
                                <div className="text-sm text-gray-600">
                                  <span className="font-medium">Address:</span> {selectedPatient.address || 'Not provided'}
                                </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Referral Information</h3>
                  <div className="space-y-2">
                    {selectedPatient.referrerName ? (
                      <>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Referred by:</span> {selectedPatient.referrerName}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Referral Code:</span> {selectedPatient.referralCode}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-600">No referral</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Activity Summary</h3>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Total Purchases:</span> {selectedPatient.totalPurchases}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Total Referrals:</span> {selectedPatient.totalReferrals}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Total Earnings:</span> ${selectedPatient.totalEarnings.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Medical Information</h3>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Medical History:</span><br />
                      {selectedPatient.medicalHistory || 'None recorded'}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Allergies:</span><br />
                      {selectedPatient.allergies || 'None recorded'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Patients
