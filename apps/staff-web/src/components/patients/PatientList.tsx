import { useState } from 'react'
import { Search, Eye, Edit, User, Stethoscope } from 'lucide-react'

// Import the Patient interface from the parent component
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
  assignedConsultantId?: string;
  assignedConsultantName?: string;
  consultationStatus?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  paymentStatus?: 'paid' | 'pending' | 'overdue';
  consultationFee?: number;
  visits?: {
    id: string;
    patientId: string;
    visitDate: Date;
    consultantId: string;
    consultantName: string;
    visitType: 'consultation' | 'follow_up' | 'emergency' | 'routine';
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    notes?: string;
    prescriptions?: string[];
  }[];
}

interface PatientListProps {
  patients: Patient[]
  onViewPatient: (patient: Patient) => void
  onEditPatient: (patient: Patient) => void
  onAssignConsultant: (patient: Patient) => void
}

function PatientList({ patients, onViewPatient, onEditPatient, onAssignConsultant }: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm) ||
    patient.referralCode?.toLowerCase().includes(searchTerm.toLowerCase())
  )


  const getStatusBadge = (status?: string) => {
    if (!status) return <span className="text-sm text-gray-500">Not assigned</span>
    
    const statusConfig = {
      pending: { color: 'bg-yellow-500 text-white', text: 'Pending' },
      in_progress: { color: 'bg-blue-500 text-white', text: 'In Progress' },
      completed: { color: 'bg-primary text-white', text: 'Completed' },
      cancelled: { color: 'bg-red-500 text-white', text: 'Cancelled' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const getPaymentStatusText = (status?: string) => {
    if (!status) return <span className="text-sm text-gray-500">Unknown</span>
    
    const statusConfig = {
      paid: { text: 'Paid', color: 'text-primary' },
      pending: { text: 'Pending', color: 'text-yellow-600' },
      overdue: { text: 'Overdue', color: 'text-red-600' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return (
      <span className={`text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex justify-end">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name, email, phone, or referral code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Switch
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {patient.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.phone || 'No phone'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.assignedConsultantName ? (
                      <div className="text-sm text-gray-900">{patient.assignedConsultantName}</div>
                    ) : (
                      <span className="text-sm text-gray-500">Not assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(patient.consultationStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {patient.visits && patient.visits.length > 0 
                        ? patient.visits[patient.visits.length - 1].visitDate.toLocaleDateString()
                        : 'No visits'
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatusText(patient.paymentStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${patient.consultationFee || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => {
                          const newStatus = patient.paymentStatus === 'paid' ? 'pending' : 'paid'
                          console.log(`Toggling payment status for ${patient.firstName} ${patient.lastName} to ${newStatus}`)
                          // Here you would update the patient's payment status
                        }}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                          patient.paymentStatus === 'paid' ? 'bg-primary' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            patient.paymentStatus === 'paid' ? 'translate-x-4' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onAssignConsultant(patient)}
                        className="text-blue-600 hover:text-blue-900 flex items-center text-sm"
                        title="Assign Consultant"
                      >
                        <Stethoscope className="h-4 w-4 mr-1" />
                        Assign
                      </button>
                      <button
                        onClick={() => onViewPatient(patient)}
                        className="text-primary hover:text-primary-dark"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditPatient(patient)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Edit Patient"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria' : 'No patients registered yet'}
          </p>
        </div>
      )}
    </div>
  )
}

export default PatientList
