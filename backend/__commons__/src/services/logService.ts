import winston from 'winston'
import WinstonCloudwatch from 'winston-cloudwatch'
import path from 'path'

const AWS_LOG_GROUP = process.env.AWS_CW_GROUP
const AWS_LOG_STREAM = process.env.AWS_CW_STREAM
const AWS_LOG_REGION = process.env.AWS_CW_REGION
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.errors({
      stack: true
    }),
    winston.format.json()
  ),
  transports: [
    new WinstonCloudwatch({
      level: 'error',
      logGroupName: AWS_LOG_GROUP,
      logStreamName: AWS_LOG_STREAM,
      awsRegion: AWS_LOG_REGION,
      awsAccessKeyId: AWS_ACCESS_KEY_ID,
      awsSecretKey: AWS_SECRET_ACCESS_KEY
    }),
    new winston.transports.File({
      filename: path.join(__dirname, '..', '..', 'logs', 'info.log'), level: 'info'
    })
  ]
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

export default logger