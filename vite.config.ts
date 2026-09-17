import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

// Lets `npm run dev` serve POST /api/ai/enhance itself (via the same
// handler the real Vercel function uses in production), so the AI feature
// works locally without a second process or `vercel dev` — see README.
function aiEnhanceDevMiddleware(): Plugin {
  return {
    name: 'pvi-ai-enhance-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/ai/enhance', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ ok: false, message: 'Method not allowed.' }))
          return
        }
        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', async () => {
          try {
            const { handleEnhanceRequest } = await import('./api/_lib/enhanceHandler.js')
            const payload = body ? JSON.parse(body) : {}
            const result = await handleEnhanceRequest(payload)
            res.statusCode = result.status
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(result.body))
          } catch {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: false, message: 'Something went wrong. Please try again.' }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Makes .env's GROQ_API_KEY/GROQ_MODEL available to the dev middleware
  // above via process.env, exactly as Vercel provides them in production.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), aiEnhanceDevMiddleware()],
  }
})
