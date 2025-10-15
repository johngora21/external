import React, { useState } from 'react'
import { X, User, Phone, Mail, Calendar, MapPin, UserPlus } from 'lucide-react'

interface AddPatientProps {
  onClose: () => void
  onPatientAdded: () => void
  patient?: any // For edit mode
  isEditMode?: boolean // To determine if it's edit or add mode
}

interface ReferralInfo {
  referrerId?: string
  referrerName?: string
  referralCode?: string
}

function AddPatient({ onClose, onPatientAdded, patient, isEditMode = false }: AddPatientProps) {
  const [patientType, setPatientType] = useState<'new' | 'existing'>('new')
  const [patientId, setPatientId] = useState('')
  const [formData, setFormData] = useState({
    firstName: isEditMode && patient ? patient.firstName : '',
    lastName: isEditMode && patient ? patient.lastName : '',
    email: isEditMode && patient ? patient.email || '' : '',
    phone: isEditMode && patient ? patient.phone || '' : '',
    dateOfBirth: isEditMode && patient && patient.dateOfBirth ? 
      patient.dateOfBirth.toISOString().split('T')[0] : '',
    gender: isEditMode && patient ? patient.gender || '' : '',
    citizenship: isEditMode && patient ? patient.citizenship || '' : '',
    country: isEditMode && patient ? patient.country || '' : '',
    region: isEditMode && patient ? patient.region || '' : '',
    address: isEditMode && patient ? patient.address || '' : '',
    emergencyContact: isEditMode && patient ? patient.emergencyContact || '' : '',
    medicalHistory: isEditMode && patient ? patient.medicalHistory || '' : '',
    allergies: isEditMode && patient ? patient.allergies || '' : '',
    weight: isEditMode && patient ? patient.weight?.toString() || '' : '',
    height: isEditMode && patient ? patient.height?.toString() || '' : '',
    consultationFee: isEditMode && patient ? patient.consultationFee?.toString() || '' : ''
  })

  const [referralInfo, setReferralInfo] = useState<ReferralInfo>({})
  const [showReferralForm, setShowReferralForm] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Here you would typically save to database
    // Generate auto ID for new patients
    const generatedId = patientType === 'new' ? `P${Date.now()}` : patientId
    
    console.log('Patient data:', { 
      patientType,
      patientId: generatedId,
      ...formData, 
      referralInfo 
    })
    
    // Simulate API call
    setTimeout(() => {
      onPatientAdded()
      onClose()
    }, 1000)
  }

  const handleReferralSearch = (code: string) => {
    // Simulate finding referrer by code
    if (code === 'REF123') {
      setReferralInfo({
        referrerId: 'patient-456',
        referrerName: 'John Smith',
        referralCode: code
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {isEditMode ? 'Edit Patient' : 'Add New Patient'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Patient Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Type
                </label>
                <select
                  value={patientType}
                  onChange={(e) => setPatientType(e.target.value as 'new' | 'existing')}
                  className="select-field"
                >
                  <option value="new">New Patient</option>
                  <option value="existing">Existing Patient (Has Referral)</option>
                </select>
              </div>
              
              {patientType === 'existing' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient ID *
                  </label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="input-field"
                    placeholder="Enter patient ID"
                    required={patientType === 'existing'}
                  />
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="input-field pl-10"
                      placeholder="Enter first name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="input-field"
                    placeholder="Enter last name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="input-field pl-10"
                      placeholder="Enter email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="input-field pl-10"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="select-field"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Weight and Height */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="input-field"
                    placeholder="Enter weight in kg"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="input-field"
                    placeholder="Enter height in cm"
                    min="0"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-900 mb-3">Address Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Citizenship
                    </label>
                    <input
                      type="text"
                      value={formData.citizenship}
                      onChange={(e) => setFormData({...formData, citizenship: e.target.value})}
                      className="input-field"
                      placeholder="Enter citizenship"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="input-field"
                      placeholder="Enter country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Region/City
                    </label>
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                      className="input-field"
                      placeholder="Enter region or city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="input-field pl-10 h-20 resize-none"
                        placeholder="Enter street address"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Information */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Referral Information</h3>
                <button
                  type="button"
                  onClick={() => setShowReferralForm(!showReferralForm)}
                  className="flex items-center space-x-2 text-primary hover:text-primary-dark"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {showReferralForm ? 'Hide' : 'Add'} Referral
                  </span>
                </button>
              </div>

        {showReferralForm && (
          <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referral Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter referral code (e.g., REF123)"
                      onChange={(e) => handleReferralSearch(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  
                  {referralInfo.referrerName && (
                    <div className="bg-white p-3 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Referred by:</span> {referralInfo.referrerName}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Referral Code: {referralInfo.referralCode}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        💰 Referrer will earn $25 when this patient makes their first purchase
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Medical Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Fee ($)
                  </label>
                  <input
                    type="number"
                    value={formData.consultationFee}
                    onChange={(e) => setFormData({...formData, consultationFee: e.target.value})}
                    className="input-field"
                    placeholder="Enter consultation fee"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical History
                  </label>
                  <textarea
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                    className="input-field h-20 resize-none"
                    placeholder="Previous medical conditions, surgeries, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allergies
                  </label>
                  <textarea
                    value={formData.allergies}
                    onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                    className="input-field h-20 resize-none"
                    placeholder="Known allergies and reactions"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
{isEditMode ? 'Update Patient' : 'Add Patient'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddPatient
