import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Dashboard from './pages/Dashboard'
import Patients from './pages/Patients'
import Consultations from './pages/Consultations'
import Supplements from './pages/Supplements'
import Inventory from './pages/Inventory'
import Layout from './components/Layout'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="consultations" element={<Consultations />} />
        <Route path="supplements" element={<Supplements />} />
        <Route path="inventory" element={<Inventory />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
