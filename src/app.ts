import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'
import { appRoutes } from './http/routes'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation failed',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    //! TODO: Send error to monitoring service (Sentry, Bugsnag, Datalog, etc)
  }

  reply.status(500).send({ message: 'Internal server error' })
})
