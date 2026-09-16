import jwt from 'jsonwebtoken'
import { config } from '../config.js'
import { supabase } from '../db/supabase.js'

export function generateToken(payload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' })
}

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null
    return next()
  }

  const token = authHeader.split(' ')[1]

  // If Supabase is available, verify with Supabase Auth
  if (supabase) {
    supabase.auth.getUser(token)
      .then(({ data, error }) => {
        req.user = error ? null : data.user
        next()
      })
      .catch(() => {
        req.user = null
        next()
      })
    return
  }

  // Fallback: verify with custom JWT (offline/no-Supabase mode)
  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    req.user = decoded
  } catch (err) {
    req.user = null
  }
  next()
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized. Authentication token required.' })
  }
  next()
}

export function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles.map(r => r.toLowerCase()) : [allowedRoles.toLowerCase()]
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    const userRole = (req.user.role || '').toLowerCase()
    const matches = roles.includes(userRole) || (roles.includes('mentor') && ['mentor', 'admin', 'faculty'].includes(userRole))
    if (!matches) {
      return res.status(403).json({ error: `Forbidden: Requires one of [${roles.join(', ')}] role` })
    }
    next()
  }
}
