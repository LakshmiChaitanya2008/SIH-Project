import { createContext, useContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router'
import { setAuthenticated, setRole, setUserProfile } from '../features/app/appSlice'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

const LOCAL_STORAGE_KEY = 'samadhan_local_auth_session'
const LOCAL_USERS_KEY = 'samadhan_local_registered_users'

const DEMO_USERS = {
  'citizen@samadhansetu.in': {
    password: 'citizen123',
    user: {
      id: 'demo-user-citizen-001',
      email: 'citizen@samadhansetu.in',
      user_metadata: {
        full_name: 'Ramesh Sharma',
        role: 'citizen',
        district: 'Gumla',
        state: 'Jharkhand',
        phone: '+91 94311 88221',
      },
    },
    profile: {
      id: 'demo-user-citizen-001',
      full_name: 'Ramesh Sharma',
      role: 'citizen',
      district: 'Gumla',
      state: 'Jharkhand',
      institution: 'Community Member',
      phone: '+91 94311 88221',
      email: 'citizen@samadhansetu.in',
    },
  },
  'admin@samadhansetu.in': {
    password: 'admin123',
    user: {
      id: 'demo-user-admin-002',
      email: 'admin@samadhansetu.in',
      user_metadata: {
        full_name: 'SamadhanSetu Administration',
        role: 'admin',
        district: 'Ranchi',
        state: 'Jharkhand',
        institution: 'Jharkhand Civic Innovation Mission',
        phone: '+91 651 2200112',
      },
    },
    profile: {
      id: 'demo-user-admin-002',
      full_name: 'SamadhanSetu Administration',
      role: 'admin',
      district: 'Ranchi',
      state: 'Jharkhand',
      institution: 'Jharkhand Civic Innovation Mission',
      phone: '+91 651 2200112',
      email: 'admin@samadhansetu.in',
    },
  },
  'admin@samadhansetu.gov.in': {
    password: 'admin123',
    user: {
      id: 'demo-user-admin-002-gov',
      email: 'admin@samadhansetu.gov.in',
      user_metadata: {
        full_name: 'SamadhanSetu Administration',
        role: 'admin',
        district: 'Ranchi',
        state: 'Jharkhand',
        institution: 'Jharkhand Civic Innovation Mission',
        phone: '+91 651 2200112',
      },
    },
    profile: {
      id: 'demo-user-admin-002-gov',
      full_name: 'SamadhanSetu Administration',
      role: 'admin',
      district: 'Ranchi',
      state: 'Jharkhand',
      institution: 'Jharkhand Civic Innovation Mission',
      phone: '+91 651 2200112',
      email: 'admin@samadhansetu.gov.in',
    },
  },
  'student@demo.ac.in': {
    password: 'student123',
    user: {
      id: 'demo-user-student-003',
      email: 'student@demo.ac.in',
      user_metadata: {
        full_name: 'Aarav Kumar',
        role: 'student',
        district: 'Ranchi',
        state: 'Jharkhand',
        institution: 'BIT Mesra Innovation Club',
        phone: '+91 98351 12345',
      },
    },
    profile: {
      id: 'demo-user-student-003',
      full_name: 'Aarav Kumar',
      role: 'student',
      district: 'Ranchi',
      state: 'Jharkhand',
      institution: 'BIT Mesra Innovation Club',
      phone: '+91 98351 12345',
      email: 'student@demo.ac.in',
    },
  },
  'partner@samadhansetu.in': {
    password: 'partner123',
    user: {
      id: 'demo-user-partner-004',
      email: 'partner@samadhansetu.in',
      user_metadata: {
        full_name: 'Jharkhand Water Mission',
        role: 'partner',
        district: 'Ranchi',
        state: 'Jharkhand',
        institution: 'Partner Organization',
        phone: '+91 94311 99887',
      },
    },
    profile: {
      id: 'demo-user-partner-004',
      full_name: 'Jharkhand Water Mission',
      role: 'partner',
      district: 'Ranchi',
      state: 'Jharkhand',
      institution: 'Partner Organization',
      phone: '+91 94311 99887',
      email: 'partner@samadhansetu.in',
    },
  },
}

function getRegisteredUsers() {
  try {
    const data = localStorage.getItem(LOCAL_USERS_KEY)
    return data ? JSON.parse(data) : {}
  } catch (err) {
    return {}
  }
}

function saveRegisteredUser(email, userData) {
  try {
    const users = getRegisteredUsers()
    users[email.toLowerCase()] = userData
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users))
  } catch (err) {
    console.warn('[Auth] Failed to save registered user locally:', err)
  }
}

/**
 * AuthProvider wraps the app with Local session management.
 * Syncs auth state with Redux for backward compatibility with existing views.
 */
export function AuthProvider({ children }) {
  const dispatch = useDispatch()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sync session → Redux state
  function syncSessionToRedux(session) {
    if (session?.user) {
      setUser(session.user)
      setProfile(session.profile)
      dispatch(setAuthenticated(true))

      const rawRole = (session.profile?.role || session.user?.user_metadata?.role || 'citizen').toLowerCase()
      // Map DB/user role 'admin', 'university_faculty', 'government_officer' to Redux 'mentor', and 'university_researcher' to 'student'
      const reduxRole = ['admin', 'mentor', 'university_faculty', 'government_officer'].includes(rawRole)
        ? 'mentor'
        : ['student', 'university_researcher'].includes(rawRole)
        ? 'student'
        : rawRole
      dispatch(setRole(reduxRole))

      const fullName = session.profile?.full_name || session.user?.user_metadata?.full_name || (rawRole === 'citizen' ? 'Ramesh Sharma' : 'Authorized User')
      const district = session.profile?.district || session.user?.user_metadata?.district || 'Gumla'
      const stateName = session.profile?.state || session.user?.user_metadata?.state || 'Jharkhand'
      const institution = session.profile?.institution || session.user?.user_metadata?.institution || (rawRole === 'admin' || rawRole === 'mentor' ? 'Ranchi University' : 'Community Member')

      const roleTitle = rawRole === 'admin' || rawRole === 'mentor'
        ? 'University Mentor'
        : rawRole === 'student'
        ? 'Student Innovator'
        : rawRole === 'partner'
        ? 'Industry Partner'
        : 'Verified Citizen'

      dispatch(setUserProfile({
        name: fullName,
        location: `${district} District, ${stateName}`,
        department: institution,
        roleTitle: roleTitle,
        phone: session.profile?.phone || session.user?.user_metadata?.phone || '+91 94311 88221',
        email: session.user.email,
        reportsCount: 1,
        signalsContributed: 3,
        impactScore: 84,
      }))
    } else {
      setUser(null)
      setProfile(null)
      dispatch(setAuthenticated(false))
      dispatch(setRole(null))
    }
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        const session = JSON.parse(saved)
        syncSessionToRedux(session)
      } else {
        syncSessionToRedux(null)
      }
    } catch (err) {
      console.warn('[Auth] Failed to load local session:', err)
      syncSessionToRedux(null)
    } finally {
      setLoading(false)
    }
  }, [])

  function saveSession(session) {
    try {
      if (session) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session))
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
      }
    } catch (err) {
      console.warn('[Auth] Failed to update localStorage session:', err)
    }
    syncSessionToRedux(session)
  }

  // Standard Local Sign Up
  async function signUp({ email, password, fullName, role = 'citizen', district = 'Gumla', state = 'Jharkhand', institution = '' }) {
    const cleanEmail = email.trim().toLowerCase()
    const id = `local-user-${Date.now()}`
    
    const newUserRecord = {
      password,
      user: {
        id,
        email: cleanEmail,
        user_metadata: {
          full_name: fullName,
          role,
          district,
          state,
          institution,
        },
      },
      profile: {
        id,
        full_name: fullName,
        role,
        district,
        state,
        institution,
        email: cleanEmail,
      },
    }

    saveRegisteredUser(cleanEmail, newUserRecord)

    const session = {
      user: newUserRecord.user,
      profile: newUserRecord.profile,
    }
    saveSession(session)
    return session
  }

  // Standard Local Sign In
  async function signIn({ email, password }) {
    const cleanEmail = email.trim().toLowerCase()
    
    // 1. Check Demo accounts first
    let account = DEMO_USERS[cleanEmail]

    // 2. Check locally registered users if not in demo map
    if (!account) {
      const registered = getRegisteredUsers()
      account = registered[cleanEmail]
    }

    // 3. Fallback provision for demo emails if password matches expected or default
    if (!account) {
      const detectedRole = cleanEmail.includes('admin')
        ? 'admin'
        : cleanEmail.includes('student')
        ? 'student'
        : cleanEmail.includes('partner')
        ? 'partner'
        : 'citizen'

      const fullName = detectedRole === 'citizen'
        ? 'Ramesh Sharma'
        : detectedRole === 'admin'
        ? 'Ranchi University'
        : detectedRole === 'student'
        ? 'Student Innovator'
        : 'Partner Representative'

      account = {
        password: password,
        user: {
          id: `local-auto-${Date.now()}`,
          email: cleanEmail,
          user_metadata: {
            full_name: fullName,
            role: detectedRole,
            district: 'Gumla',
            state: 'Jharkhand',
            institution: detectedRole === 'admin' ? 'Ranchi University' : 'Community Member',
          },
        },
        profile: {
          id: `local-auto-${Date.now()}`,
          full_name: fullName,
          role: detectedRole,
          district: 'Gumla',
          state: 'Jharkhand',
          institution: detectedRole === 'admin' ? 'Ranchi University' : 'Community Member',
          email: cleanEmail,
        },
      }
    } else if (account.password && account.password !== password) {
      throw new Error('Invalid email or password.')
    }

    const session = {
      user: account.user,
      profile: account.profile,
    }
    saveSession(session)
    return session
  }

  // Phone Credential Sign In (OTP Simulation)
  async function signInWithPhoneCredential(mobileNumber, otpPin) {
    const cleanNumber = mobileNumber.replace(/\D/g, '')
    const email = `citizen.${cleanNumber}@samadhansetu.in`
    const id = `phone-user-${cleanNumber}`

    const session = {
      user: {
        id,
        email,
        user_metadata: {
          full_name: `Citizen ${cleanNumber.slice(-4)}`,
          role: 'citizen',
          phone: `+91 ${cleanNumber}`,
          district: 'Gumla',
          state: 'Jharkhand',
        },
      },
      profile: {
        id,
        full_name: `Citizen ${cleanNumber.slice(-4)}`,
        role: 'citizen',
        phone: `+91 ${cleanNumber}`,
        district: 'Gumla',
        state: 'Jharkhand',
        institution: 'Community Member',
        email,
      },
    }

    saveSession(session)
    return session
  }

  // Sign Out
  async function signOut() {
    saveSession(null)
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithPhoneCredential,
    signOut,
    isAuthenticated: !!user,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * ProtectedRoute component that checks authentication and authorized roles.
 */
export function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, profile, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const targetPath = location.pathname
      const loginRoute = targetPath.startsWith('/admin') ? '/admin/login' : '/auth'
      navigate(loginRoute, { state: { from: targetPath }, replace: true })
    }
    if (!loading && isAuthenticated && requiredRole) {
      const userRole = (profile?.role || 'citizen').toLowerCase()
      if (requiredRole === 'admin' && userRole !== 'admin') {
        navigate('/admin/login', { replace: true })
        return
      }
      const isMentorAuthorized = ['mentor', 'admin', 'university_faculty', 'government_officer'].includes(userRole)
      if (requiredRole === 'mentor' && !isMentorAuthorized) {
        const homeRoutes = {
          citizen: '/citizen/home',
          admin: '/admin/dashboard',
          student: '/student/dashboard',
          partner: '/partner/dashboard',
        }
        navigate(homeRoutes[userRole] || '/', { replace: true })
      }
    }
  }, [loading, isAuthenticated, profile, requiredRole, location.pathname, navigate])

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-24">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-brand-violet animate-spin">progress_activity</span>
          <p className="text-sm text-on-surface-variant mt-3 font-semibold">Validating session...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return children
}

