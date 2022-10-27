import express, { Router } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import logger from 'morgan'

function getCorsOrigin() {
  const origin = process.env.CORS_ORIGIN

  if (!origin) {
    throw new Error('CORS_ORIGIN is a required env var.')
  }

  if (origin === '*') {
    return origin
  }

  return new RegExp(origin)
}

export default (router: Router) => {
  const app = express()
  app.use(logger('dev'))
  app.use(helmet())

  const corOptions = {
    origin: getCorsOrigin(),
    optionsSuccessStatus: 200
  }
  app.use(cors(corOptions))

  app.use(express.json())
  app.use(router)

  app.get('/health', (req, res) => {
    res.json({
      message: `${process.env.SERVICE_NAME} is up and running!`,
    })
  })

  return app;
}