import { Router } from 'express'
import { generateToken } from '../middleware/auth.js'
import { store } from '../db/store.js'
import { supabase } from '../db/supabase.js'

const router = Router()

const DEMO_USERS = {
  'admin@samadhansetu.gov.in': {
    password: 'admin123',
    user: {
      id: 'demo-user-admin-002-gov',
      email: 'admin@samadhansetu.gov.in',
      full_name: 'SamadhanSetu Administration',
      role: 'admin',
      district: 'Ranchi',
      state: 'Jharkhand',
      institution: 'Jharkhand Civic Innovation Mission',
    }
  },
  'admin@samadhansetu.in': {
    password: 'admin123',
    user: {
      id: 'demo-user-admin-002',
      email: 'admin@samadhansetu.in',
      full_name: 'SamadhanSetu Administration',
      role: 'admin',
      district: 'Ranchi',
      state: 'Jharkhand',
      institution: 'Jharkhand Civic Innovation Mission',
    }
  },
  'citizen@samadhansetu.in': {
    password: 'citizen123',
    user: {
      id: 'demo-user-citizen-001',
      email: 'citizen@samadhansetu.in',
      full_name: 'Ramesh Sharma',
      role: 'citizen',
      district: 'Gumla',
      state: 'Jharkhand',
      institution: 'Community Member',
    }
  },
  'student@demo.ac.in': {
    password: 'student123',
    user: {
      id: 'demo-user-student-003',
      email: 'student@demo.ac.in',
      full_name: 'Aarav Kumar',
      role: 'student',
      district: 'Ranchi',
      state: 'Jharkhand',
      institution: 'BIT Mesra Innovation Club',
    }
  },
  'partner@samadhansetu.in': {
    password: 'partner123',
    user: {
      id: 'demo-user-partner-004',
      email: 'partner@samadhansetu.in',
      full_name: 'Jharkhand Water Mission',
      role: 'partner',
      district: 'Ranchi',
      state: 'Jharkhand',
      institution: 'Partner Organization',
    }
  }
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const cleanEmail = email.trim().toLowerCase()

  // If Supabase is available, authenticate via Supabase Auth
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })
      if (error) {
        return res.status(401).json({ error: error.message })
      }

      // Fetch profile from public.users
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      return res.json({
        token: data.session?.access_token,
        user: data.user,
        profile: profile || data.user,
      })
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Authentication failed' })
    }
  }

  // Fallback: mock auth (offline/no-Supabase mode)
  let account = DEMO_USERS[cleanEmail] || store.users.get(cleanEmail)

  if (!account) {
    // Dynamically auto-provision for convenience
    const role = cleanEmail.includes('admin') ? 'admin' : cleanEmail.includes('student') ? 'student' : 'citizen'
    account = {
      password,
      user: {
        id: `user-${Date.now()}`,
        email: cleanEmail,
        full_name: cleanEmail.split('@')[0].toUpperCase(),
        role,
        district: 'Gumla',
        state: 'Jharkhand',
      }
    }
    store.users.set(cleanEmail, account)
  } else if (account.password && account.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = generateToken(account.user)
  return res.json({
    token,
    user: account.user,
    profile: account.user
  })
})

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, fullName, role = 'citizen', district = 'Gumla', state = 'Jharkhand', institution = '' } = req.body || {}
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const cleanEmail = email.trim().toLowerCase()
  const dbRole = (role || 'citizen').toUpperCase()

  // If Supabase is available, register via Supabase Auth
  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: fullName || cleanEmail.split('@')[0],
            role: dbRole,
            district,
            state,
            institution,
          }
        }
      })
      if (error) {
        return res.status(400).json({ error: error.message })
      }

      // Ensure public.users row exists
      if (data.user) {
        await supabase.from('users').upsert({
          id: data.user.id,
          email: cleanEmail,
          full_name: fullName || cleanEmail.split('@')[0],
          role: dbRole,
          district,
          state,
          institution,
          status: 'ACTIVE',
        }, { onConflict: 'id' })
      }

      return res.status(201).json({
        token: data.session?.access_token,
        user: data.user,
        profile: data.user,
      })
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Registration failed' })
    }
  }

  // Fallback: mock registration
  const user = {
    id: `user-${Date.now()}`,
    email: cleanEmail,
    full_name: fullName || cleanEmail.split('@')[0],
    role,
    district,
    state,
    institution
  }

  store.users.set(cleanEmail, { password, user })
  const token = generateToken(user)

  return res.status(201).json({
    token,
    user,
    profile: user
  })
})

// POST /api/auth/phone/otp
router.post('/phone/otp', async (req, res) => {
  const { mobileNumber } = req.body || {}
  const cleanNumber = (mobileNumber || '').replace(/\D/g, '') || '9431188221'
  const email = `citizen.${cleanNumber}@samadhansetu.in`
  const password = `phone-${cleanNumber}-setu2026`

  // If Supabase is available, create/sign-in derived-email user
  if (supabase) {
    try {
      // Try sign in first
      let result = await supabase.auth.signInWithPassword({ email, password })
      if (result.error) {
        // User doesn't exist — create them
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: `Citizen ${cleanNumber.slice(-4)}`,
              role: 'CITIZEN',
              phone: `+91 ${cleanNumber}`,
              district: 'Gumla',
              state: 'Jharkhand',
            }
          }
        })
        if (signUpError) {
          return res.status(400).json({ error: signUpError.message })
        }
        result = await supabase.auth.signInWithPassword({ email, password })
        if (result.error) {
          return res.status(401).json({ error: result.error.message })
        }
      }

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', result.data.user.id)
        .single()

      return res.json({
        token: result.data.session?.access_token,
        user: result.data.user,
        profile: profile || result.data.user,
      })
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Phone auth failed' })
    }
  }

  // Fallback: mock phone auth
  const user = {
    id: `phone-user-${cleanNumber}`,
    email,
    full_name: `Citizen ${cleanNumber.slice(-4)}`,
    role: 'citizen',
    phone: `+91 ${cleanNumber}`,
    district: 'Gumla',
    state: 'Jharkhand',
  }

  const token = generateToken(user)
  return res.json({
    token,
    user,
    profile: user
  })
})

// GET /api/auth/me
router.get('/me', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthenticated' })
  }

  // If Supabase is available, fetch full profile
  if (supabase && req.user.id) {
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single()

    return res.json({ user: req.user, profile: profile || req.user })
  }

  return res.json({ user: req.user, profile: req.user })
})

export default router
