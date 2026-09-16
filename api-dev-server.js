import url from 'url'
import path from 'path'
import fs from 'fs'
import { loadEnv } from 'vite'

/**
 * Vite Dev Server Middleware for Vercel Serverless Functions in /api/
 * 
 * Polyfills Vercel Serverless environment:
 * - Injects .env variables into process.env for backend handlers
 * - Parses request body (JSON)
 * - Parses URL query parameters
 * - Attaches res.status() and res.json()
 * - Maps /api/* requests to api/*.js handlers
 */
export function vercelApiDevPlugin() {
  // Load all environment variables from .env into process.env
  try {
    const env = loadEnv('development', process.cwd(), '')
    Object.assign(process.env, env)
  } catch (envErr) {
    console.warn('[Vite API Middleware] Could not load .env via loadEnv:', envErr.message)
  }

  return {
    name: 'vercel-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) {
          return next()
        }

        const parsedUrl = url.parse(req.url, true)
        let pathname = parsedUrl.pathname // e.g. /api/ai/understand

        // Polyfill route matching for /api/admin/problem/:id/trace
        const problemTraceMatch = pathname.match(/^\/api\/admin\/problem\/([^/]+)\/trace$/)
        if (problemTraceMatch) {
          pathname = '/api/admin/trace'
          parsedUrl.query = parsedUrl.query || {}
          parsedUrl.query.id = problemTraceMatch[1]
        }

        // Resolve handler file path
        const projectRoot = process.cwd()
        let relativePath = pathname.replace(/^\/api\/?/, '') // e.g. ai/understand
        if (!relativePath) relativePath = 'index'

        let handlerFilePath = path.join(projectRoot, 'api', `${relativePath}.js`)
        if (!fs.existsSync(handlerFilePath)) {
          handlerFilePath = path.join(projectRoot, 'api', relativePath, 'index.js')
        }

        if (!fs.existsSync(handlerFilePath)) {
          console.warn(`[Vite API Middleware] Route not found for: ${pathname} (${handlerFilePath})`)
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: `API route not found: ${pathname}` }))
          return
        }

        // Attach query params
        req.query = parsedUrl.query || {}

        // Polyfill res.status and res.json
        res.status = (code) => {
          res.statusCode = code
          return res
        }

        res.json = (data) => {
          if (!res.headersSent) {
            res.setHeader('Content-Type', 'application/json')
          }
          res.end(JSON.stringify(data))
        }

        // Parse JSON body for mutation methods
        const methodsWithBody = ['POST', 'PUT', 'PATCH', 'DELETE']
        if (methodsWithBody.includes(req.method.toUpperCase())) {
          try {
            const bodyData = await readRequestBody(req)
            req.body = bodyData
          } catch (bodyErr) {
            console.warn('[Vite API Middleware] Body parse error:', bodyErr.message)
            req.body = {}
          }
        } else {
          req.body = {}
        }

        try {
          // Dynamically import the handler (bust cache for instant hot-reloading)
          const fileUrl = url.pathToFileURL(handlerFilePath).href + `?t=${Date.now()}`
          const module = await import(fileUrl)
          const handler = module.default

          if (typeof handler !== 'function') {
            res.status(500).json({ error: `Handler in ${handlerFilePath} is not a function` })
            return
          }

          await handler(req, res)
        } catch (err) {
          console.error(`[Vite API Middleware Exception in ${pathname}]:`, err)
          if (!res.headersSent) {
            res.status(500).json({ error: err.message || 'Internal Serverless Execution Error' })
          }
        }
      })
    },
  }
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      if (!body.trim()) return resolve({})
      try {
        resolve(JSON.parse(body))
      } catch (err) {
        resolve(body)
      }
    })
    req.on('error', reject)
  })
}
