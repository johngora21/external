import React, { createContext, useContext, ReactNode } from 'react'

type UserRole = 'superadmin' | 'station_admin' | 'receptionist' | 'consultant' | 'pharmacist' | 'member';

interface User {
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

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'receptionist@eternalbranch.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'receptionist',
    clinicId: 'clinic-1',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    email: 'consultant@eternalbranch.com',
    firstName: 'Dr. Michael',
    lastName: 'Chen',
    role: 'consultant',
    clinicId: 'clinic-1',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    email: 'pharmacist@eternalbranch.com',
    firstName: 'Emma',
    lastName: 'Rodriguez',
    role: 'pharmacist',
    clinicId: 'clinic-1',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = React.useState<User | null>(mockUsers[2]) // Default to pharmacist
  const [loading, setLoading] = React.useState(false)

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const foundUser = mockUsers.find(u => u.email === credentials.email)
      
      if (foundUser && credentials.password === 'password123') {
        setUser(foundUser)
        setLoading(false)
        return true
      } else {
        setLoading(false)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
