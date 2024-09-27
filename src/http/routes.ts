import { FastifyInstance } from 'fastify'

import { authenticate } from './controllers/authenticate'
import { profile } from './controllers/profile'
import { registerUser } from './controllers/register-user'
import { verifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', registerUser)
  app.post('/sessions', authenticate)

  // Authenticated
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
