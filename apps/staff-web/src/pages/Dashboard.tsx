import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Users, 
  Stethoscope, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
  PieChart,
  BarChart3,
  UserPlus,
  Clock,
  Award
} from 'lucide-react'
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

function Dashboard() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState('daily')

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'receptionist': return 'Receptionist'
      case 'consultant': return 'Consultant'
      case 'pharmacist': return 'Pharmacist'
      default: return role
    }
  }

  const getDashboardData = () => {
    const stats = {
      daily: [
        { label: 'New Patients', value: '12', growth: '+8.5%', icon: UserPlus, color: 'bg-primary' },
        { label: 'Consultations', value: '18', growth: '+12.3%', icon: Stethoscope, color: 'bg-blue-500' },
        { label: 'Revenue', value: '$4,250', growth: '+15.7%', icon: DollarSign, color: 'bg-green-500' },
        { label: 'PV Points', value: '2,150', growth: '+18.2%', icon: Award, color: 'bg-purple-500' },
      ],
      weekly: [
        { label: 'Total Patients', value: '84', growth: '+6.8%', icon: UserPlus, color: 'bg-primary' },
        { label: 'Consultations', value: '126', growth: '+9.4%', icon: Stethoscope, color: 'bg-blue-500' },
        { label: 'Revenue', value: '$28,450', growth: '+13.1%', icon: DollarSign, color: 'bg-green-500' },
        { label: 'PV Points', value: '14,200', growth: '+16.7%', icon: Award, color: 'bg-purple-500' },
      ],
      monthly: [
        { label: 'Total Patients', value: '342', growth: '+5.2%', icon: UserPlus, color: 'bg-primary' },
        { label: 'Consultations', value: '516', growth: '+7.8%', icon: Stethoscope, color: 'bg-blue-500' },
        { label: 'Revenue', value: '$112,800', growth: '+11.4%', icon: DollarSign, color: 'bg-green-500' },
        { label: 'PV Points', value: '56,400', growth: '+14.9%', icon: Award, color: 'bg-purple-500' },
      ],
      quarterly: [
        { label: 'Total Patients', value: '1,026', growth: '+4.1%', icon: UserPlus, color: 'bg-primary' },
        { label: 'Consultations', value: '1,548', growth: '+6.3%', icon: Stethoscope, color: 'bg-blue-500' },
        { label: 'Revenue', value: '$338,400', growth: '+9.7%', icon: DollarSign, color: 'bg-green-500' },
        { label: 'PV Points', value: '169,200', growth: '+12.8%', icon: Award, color: 'bg-purple-500' },
      ],
      semiannual: [
        { label: 'Total Patients', value: '2,052', growth: '+3.5%', icon: UserPlus, color: 'bg-primary' },
        { label: 'Consultations', value: '3,096', growth: '+5.2%', icon: Stethoscope, color: 'bg-blue-500' },
        { label: 'Revenue', value: '$676,800', growth: '+8.1%', icon: DollarSign, color: 'bg-green-500' },
        { label: 'PV Points', value: '338,400', growth: '+10.6%', icon: Award, color: 'bg-purple-500' },
      ],
      yearly: [
        { label: 'Total Patients', value: '4,104', growth: '+2.8%', icon: UserPlus, color: 'bg-primary' },
        { label: 'Consultations', value: '6,192', growth: '+4.3%', icon: Stethoscope, color: 'bg-blue-500' },
        { label: 'Revenue', value: '$1,353,600', growth: '+6.7%', icon: DollarSign, color: 'bg-green-500' },
        { label: 'PV Points', value: '676,800', growth: '+8.9%', icon: Award, color: 'bg-purple-500' },
      ]
    }

    return {
      title: 'External Branch Dashboard',
      description: 'Clinic management and network marketing system',
      stats: stats[timeRange as keyof typeof stats] || stats.daily
    }
  }

  const dashboardData = getDashboardData()

  const supplementData = [
    { name: 'Vitamins', value: 30, color: '#1f8f8d' },
    { name: 'Omega-3', value: 20, color: '#3b82f6' },
    { name: 'Protein', value: 20, color: '#8b5cf6' },
    { name: 'Minerals', value: 15, color: '#f59e0b' },
    { name: 'Other', value: 15, color: '#ef4444' }
  ]

  const retentionData = [
    { name: 'Returning', value: 70, color: '#10b981' },
    { name: 'New', value: 30, color: '#3b82f6' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dashboardData.title}</h1>
          <p className="text-gray-600 mt-1">{dashboardData.description}</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="select-field w-32"
        >
          <option value="daily">Today</option>
          <option value="weekly">This Week</option>
          <option value="monthly">This Month</option>
          <option value="quarterly">3 Months</option>
          <option value="semiannual">6 Months</option>
          <option value="yearly">This Year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {dashboardData.stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${stat.color.replace('bg-', 'text-')}`} />
                <p className="text-sm text-green-600">{stat.growth}</p>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          )
        })}
      </div>


      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Revenue Trend</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            <div className="flex flex-col items-center">
              <div className="w-8 bg-primary rounded-t" style={{height: '120px'}}></div>
              <span className="text-xs text-gray-500 mt-2">Mon</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-primary rounded-t" style={{height: '160px'}}></div>
              <span className="text-xs text-gray-500 mt-2">Tue</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-primary rounded-t" style={{height: '200px'}}></div>
              <span className="text-xs text-gray-500 mt-2">Wed</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-primary rounded-t" style={{height: '140px'}}></div>
              <span className="text-xs text-gray-500 mt-2">Thu</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-primary rounded-t" style={{height: '220px'}}></div>
              <span className="text-xs text-gray-500 mt-2">Fri</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-primary rounded-t" style={{height: '180px'}}></div>
              <span className="text-xs text-gray-500 mt-2">Sat</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-primary rounded-t" style={{height: '100px'}}></div>
              <span className="text-xs text-gray-500 mt-2">Sun</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-500">Weekly Revenue: $12,340</span>
            <span className="text-green-600 font-medium">+15.2%</span>
          </div>
        </div>

        {/* Patients Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Patients Trend</h2>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            <div className="flex flex-col items-center">
              <div className="w-8 bg-blue-500 rounded-t" style={{height: '140px'}}></div>
              <span className="text-xs text-gray-500 mt-2">Mon</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-blue-500 rounded-t" style={{height: '180px'}}></div>
              <span className="text-xs text-gray-500 mt-2">Tue</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-blue-500 rounded-t" style={{height: '160px'}}></div>
              <span className="text-xs text-gray-500 mt-2">Wed</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-blue-500 rounded-t" style={{height: '200px'}}></div>
              <span className="text-xs text-gray-500 mt-2">Thu</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-blue-500 rounded-t" style={{height: '170px'}}></div>
              <span className="text-xs text-gray-500 mt-2">Fri</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-blue-500 rounded-t" style={{height: '190px'}}></div>
              <span className="text-xs text-gray-500 mt-2">Sat</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 bg-blue-500 rounded-t" style={{height: '130px'}}></div>
              <span className="text-xs text-gray-500 mt-2">Sun</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-500">Weekly Patients: 1,180</span>
            <span className="text-green-600 font-medium">+8.3%</span>
          </div>
        </div>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Supplement Sales Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Supplement Sales Distribution</h2>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={supplementData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {supplementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Retention */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Customer Retention</h2>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={retentionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {retentionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Dashboard
