import React, { useState } from 'react'
import { Plus, Search, Calendar, Stethoscope, User } from 'lucide-react'

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  clinicId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  patientType: 'new' | 'existing';
  consultantId: string;
  consultantName: string;
  date: Date;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes?: string;
  fee: number;
  status: 'pending' | 'diagnosis' | 'results' | 'supplements' | 'completed' | 'cancelled';
  step: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
const mockPatients: Patient[] = [
  { id: '1', firstName: 'John', lastName: 'Doe', email: 'john@email.com', phone: '+1-555-0123', clinicId: 'clinic-1', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@email.com', phone: '+1-555-0125', clinicId: 'clinic-1', isActive: true, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', firstName: 'Robert', lastName: 'Johnson', email: 'robert@email.com', phone: '+1-555-0127', clinicId: 'clinic-1', isActive: true, createdAt: new Date(), updatedAt: new Date() },
]

const mockConsultations: Consultation[] = [
  {
    id: '1',
    patientId: 'P1703123456789',
    patientName: 'John Doe',
    patientType: 'new',
    consultantId: 'C001',
    consultantName: 'Dr. Michael Chen',
    date: new Date('2023-12-01T10:00:00'),
    symptoms: 'Headache, fever, fatigue',
    diagnosis: 'Common cold',
    treatment: 'Rest, fluids, over-the-counter pain relief',
    prescription: 'Ibuprofen 400mg, 3 times daily for 3 days',
    notes: 'Patient advised to return if symptoms worsen',
    fee: 150,
    status: 'completed',
    step: 4,
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-01'),
  },
  {
    id: '2',
    patientId: 'P1703123456790',
    patientName: 'Jane Smith',
    patientType: 'existing',
    consultantId: 'C001',
    consultantName: 'Dr. Michael Chen',
    date: new Date('2023-12-02T14:30:00'),
    symptoms: 'Chest pain, shortness of breath',
    diagnosis: 'Anxiety-related chest discomfort',
    treatment: 'Breathing exercises, stress management',
    prescription: 'No medication required',
    notes: 'Patient to follow up in 2 weeks',
    fee: 200,
    status: 'supplements',
    step: 4,
    createdAt: new Date('2023-12-02'),
    updatedAt: new Date('2023-12-02'),
  },
  {
    id: '3',
    patientId: 'P1703123456791',
    patientName: 'Robert Johnson',
    patientType: 'new',
    consultantId: 'C002',
    consultantName: 'Dr. Sarah Wilson',
    date: new Date('2023-12-03T09:15:00'),
    symptoms: 'Back pain, limited mobility',
    diagnosis: 'Muscle strain',
    treatment: 'Physical therapy, rest',
    prescription: 'Muscle relaxant, topical pain relief',
    notes: 'Scheduled follow-up in 1 week',
    fee: 180,
    status: 'results',
    step: 3,
    createdAt: new Date('2023-12-03'),
    updatedAt: new Date('2023-12-03'),
  },
]

function Consultations() {
  const [consultations, setConsultations] = useState<Consultation[]>(mockConsultations)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null)

  const filteredConsultations = consultations.filter(consultation => {
    const patient = mockPatients.find(p => p.id === consultation.patientId)
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : ''
    return patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           consultation.symptoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
           consultation.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  })


  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-gray-600'
      case 'diagnosis':
        return 'text-orange-600'
      case 'results':
        return 'text-blue-600'
      case 'supplements':
        return 'text-purple-600'
      case 'completed':
        return 'text-primary'
      case 'cancelled':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }


  const handleUpdateConsultation = (updatedConsultation: Consultation) => {
    setConsultations(prev => prev.map(c => 
      c.id === updatedConsultation.id ? updatedConsultation : c
    ))
    setShowEditForm(false)
    setEditingConsultation(null)
  }

  const handleUpdateStatus = (consultationId: string, newStatus: 'pending' | 'diagnosis' | 'results' | 'supplements' | 'completed' | 'cancelled') => {
    setConsultations(prev => prev.map(c => 
      c.id === consultationId ? { ...c, status: newStatus, updatedAt: new Date() } : c
    ))
  }

  const handleAddConsultation = (newConsultation: Consultation) => {
    setConsultations(prev => [newConsultation, ...prev])
    setShowAddForm(false)
  }

  const ConsultationModal = ({ consultation }: { consultation: Consultation }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Consultation Details</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    {consultation.patientName}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">ID:</span>
                    {consultation.patientId}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">Type:</span>
                    {consultation.patientType}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Consultation Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    {consultation.consultantName}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDateTime(consultation.date)}
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${getStatusColor(consultation.status)}`}>
                      {consultation.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-2">Symptoms</label>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {consultation.symptoms}
                  </div>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-2">Diagnosis</label>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {consultation.diagnosis}
                  </div>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-2">Treatment</label>
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {consultation.treatment}
                  </div>
                </div>
                {consultation.prescription && (
                  <div>
                    <label className="block text-base font-semibold text-gray-900 mb-2">Prescription</label>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {consultation.prescription}
                    </div>
                  </div>
                )}
                {consultation.notes && (
                  <div>
                    <label className="block text-base font-semibold text-gray-900 mb-2">Notes</label>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {consultation.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const AddConsultationForm = ({ onSave, onCancel }: { 
    onSave: (consultation: Consultation) => void, 
    onCancel: () => void 
  }) => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
      symptoms: '',
      diagnosis: '',
      treatment: '',
      prescription: '',
      notes: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const newConsultation: Consultation = {
        id: `CONS-${Date.now()}`,
        patientId: 'P1703123456789', // This would come from the selected patient
        patientName: 'John Doe', // This would come from the selected patient
        patientType: 'existing',
        consultantId: 'C001',
        consultantName: 'Dr. Michael Chen', // Current logged in consultant
        ...formData,
        date: new Date(),
        fee: 150, // Default fee
        status: 'completed',
        step: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      onSave(newConsultation)
    }

    const nextStep = () => {
      if (step < 4) setStep(step + 1)
    }

    const saveCurrentStep = () => {
      // Save current step data (this would typically call an API)
      console.log('Saving step:', step, formData)
      // For now, just show a success message or move to next step
      if (step < 4) {
        nextStep()
      }
    }

    const prevStep = () => {
      if (step > 1) setStep(step - 1)
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add Consultation</h2>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {/* Progress Steps */}
            <div className="mb-6">
              <div className="flex items-center justify-center space-x-4">
                <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    1
                  </div>
                  <span className="ml-2 text-sm">Symptoms</span>
                </div>
                <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    2
                  </div>
                  <span className="ml-2 text-sm">Diagnosis</span>
                </div>
                <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    3
                  </div>
                  <span className="ml-2 text-sm">Results</span>
                </div>
                <div className={`w-12 h-0.5 ${step >= 4 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center ${step >= 4 ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 4 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    4
                  </div>
                  <span className="ml-2 text-sm">Treatment</span>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Symptoms */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Patient Symptoms</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                    <textarea
                      value={formData.symptoms}
                      onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                      placeholder="Describe the patient's symptoms in detail..."
                      className="input-field"
                      rows={4}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Diagnosis */}
              {step === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Diagnosis</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                    <textarea
                      value={formData.diagnosis}
                      onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                      placeholder="Enter the diagnosis..."
                      className="input-field"
                      rows={4}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Results */}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Results Summary</label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Enter test results summary..."
                      className="input-field"
                      rows={4}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Treatment */}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Treatment</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Plan</label>
                    <textarea
                      value={formData.treatment}
                      onChange={(e) => setFormData(prev => ({ ...prev, treatment: e.target.value }))}
                      placeholder="Describe the treatment plan..."
                      className="input-field"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prescription *</label>
                    <textarea
                      value={formData.prescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, prescription: e.target.value }))}
                      placeholder="Enter prescription details (supplements, dosage, duration)..."
                      className="input-field"
                      rows={2}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <div>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                    >
                      Previous
                    </button>
                  )}
                </div>
                <div className="flex space-x-3">
                  {step < 4 ? (
                    <>
                      <button
                        type="button"
                        onClick={saveCurrentStep}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                      >
                        Save Draft
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn-primary"
                      >
                        Continue
                      </button>
                    </>
                  ) : (
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const EditConsultationForm = ({ consultation, onSave, onCancel }: { 
    consultation: Consultation, 
    onSave: (consultation: Consultation) => void, 
    onCancel: () => void 
  }) => {
    const [formData, setFormData] = useState({
      symptoms: consultation.symptoms,
      diagnosis: consultation.diagnosis,
      treatment: consultation.treatment,
      prescription: consultation.prescription || '',
      notes: consultation.notes || ''
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const updatedConsultation = {
        ...consultation,
        ...formData,
        updatedAt: new Date()
      }
      onSave(updatedConsultation)
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Consultation</h2>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient</label>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-900">
                    {consultation.patientName} (ID: {consultation.patientId})
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultant</label>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-900">
                    {consultation.consultantName}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-900">
                    {formatDateTime(consultation.date)}
                  </div>
                </div>
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                  className="input-field"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                <textarea
                  value={formData.diagnosis}
                  onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                  className="input-field"
                  rows={2}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Treatment</label>
                <textarea
                  value={formData.treatment}
                  onChange={(e) => setFormData(prev => ({ ...prev, treatment: e.target.value }))}
                  className="input-field"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prescription</label>
                <textarea
                  value={formData.prescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, prescription: e.target.value }))}
                  className="input-field"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="input-field"
                  rows={2}
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Update Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Consultations</h1>
          <p className="text-gray-600 mt-1">Manage patient consultations and medical records</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-end space-x-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search consultations by patient, symptoms, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          className="select-field w-40"
          onChange={() => {
            // Filter by status logic would go here
          }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="diagnosis">Diagnosis</option>
          <option value="results">Results</option>
          <option value="supplements">Supplements</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Consultations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConsultations.map((consultation) => (
                <tr key={consultation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {consultation.patientName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {consultation.patientId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {consultation.patientType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {consultation.consultantName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDateTime(consultation.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getStatusColor(consultation.status)}`}>
                      {consultation.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedConsultation(consultation)
                          setShowModal(true)
                        }}
                        className="px-2 py-1 text-xs font-medium bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => setShowAddForm(true)}
                        className="px-2 py-1 text-xs font-medium bg-primary text-white rounded hover:bg-primary-dark flex items-center"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </button>
                      {consultation.status === 'cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(consultation.id, 'pending')}
                          className="px-2 py-1 text-xs font-medium bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Reschedule
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredConsultations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Stethoscope className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No consultations found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria' : 'Get started by scheduling your first consultation'}
          </p>
        </div>
      )}

      {/* Consultation Modal */}
      {showModal && selectedConsultation && <ConsultationModal consultation={selectedConsultation} />}

      {/* Add Consultation Form */}
      {showAddForm && (
        <AddConsultationForm
          onSave={handleAddConsultation}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Consultation Form */}
      {showEditForm && editingConsultation && (
        <EditConsultationForm
          consultation={editingConsultation}
          onSave={handleUpdateConsultation}
          onCancel={() => {
            setShowEditForm(false)
            setEditingConsultation(null)
          }}
        />
      )}
    </div>
  )
}

export default Consultations
