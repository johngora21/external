import { useState, useEffect } from 'react'
import { Search, CheckCircle, User, Stethoscope, Package, DollarSign, TrendingUp } from 'lucide-react'
import { Prescription } from '../models/Prescription'
import { prescriptionService } from '../services/prescriptionService'

function Supplements() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const statuses = ['all', 'pending', 'fulfilled', 'cancelled']

  // Load prescriptions and stats
  useEffect(() => {
    loadPrescriptions()
    loadStats()
  }, [searchTerm, selectedStatus])

  const loadPrescriptions = async () => {
    try {
      setLoading(true)
      const filters = {
        searchTerm: searchTerm || undefined,
        status: selectedStatus === 'all' ? undefined : selectedStatus
      }
      const data = await prescriptionService.getPrescriptions(filters)
      setPrescriptions(data)
    } catch (error) {
      console.error('Failed to load prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      // Stats loading logic would go here if needed
      console.log('Stats loaded')
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 text-white'
      case 'fulfilled': return 'bg-primary text-white'
      case 'cancelled': return 'bg-red-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const fulfillPrescription = async (prescriptionId: string) => {
    try {
      const success = await prescriptionService.updatePrescriptionStatus(prescriptionId, 'fulfilled')
      if (success) {
        await loadPrescriptions()
        await loadStats()
        setShowModal(false)
      }
    } catch (error) {
      console.error('Failed to fulfill prescription:', error)
    }
  }


  const PrescriptionModal = ({ prescription }: { prescription: Prescription }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Prescription Details</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Patient Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Patient Name</p>
                <p className="font-medium text-gray-900">{prescription.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Prescribed By</p>
                <p className="font-medium text-gray-900 flex items-center">
                  <Stethoscope className="h-4 w-4 mr-2 text-gray-400" />
                  {prescription.consultantName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Prescription Date</p>
                <p className="font-medium text-gray-900">{prescription.prescriptionDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                  {prescription.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Prescribed Supplements */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescribed Supplements</h3>
            <div className="space-y-4">
              {prescription.supplements.map((supplement, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{supplement.name}</h4>
                      <p className="text-sm text-gray-500">Quantity: {supplement.quantity}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-lg font-bold text-gray-900 mb-1">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${(supplement.price * supplement.quantity).toFixed(2)}
                      </div>
                      <div className="flex items-center text-sm font-medium text-primary">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {supplement.pv * supplement.quantity} PV
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consultant Notes */}
          {prescription.notes && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Consultant Notes</h3>
              <p className="text-gray-700 leading-relaxed">{prescription.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-6 border-t border-gray-200 flex justify-end">
            {prescription.status === 'pending' && (
              <button
                onClick={() => fulfillPrescription(prescription.id)}
                className="btn-primary flex items-center justify-center py-2 px-6 text-sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Fulfilled
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supplements</h1>
          <p className="text-gray-600 mt-1">Manage supplement prescriptions and fulfillment</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-end gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient, consultant, or supplement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="select-field w-40"
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>


      {/* Prescriptions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      <span className="ml-2 text-gray-500">Loading prescriptions...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                prescriptions.map((prescription) => (
                <tr key={prescription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-3">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{prescription.patientName}</div>
                        <div className="text-sm text-gray-500">ID: {prescription.patientId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Stethoscope className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">{prescription.consultantName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-primary mr-1" />
                      <span className="text-sm font-medium text-primary">{prescription.totalPV}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${prescription.totalPrice.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {prescription.prescriptionDate.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                      {prescription.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedPrescription(prescription)
                        setShowModal(true)
                      }}
                      className="text-primary hover:text-primary-dark"
                    >
                      View
                    </button>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && prescriptions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Package className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedStatus !== 'all' ? 'Try adjusting your search criteria' : 'No prescriptions available at the moment'}
          </p>
        </div>
      )}

      {/* Prescription Modal */}
      {showModal && selectedPrescription && <PrescriptionModal prescription={selectedPrescription} />}

    </div>
  )
}

export default Supplements
