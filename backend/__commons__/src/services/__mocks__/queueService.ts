import AWSMock from 'aws-sdk-mock'
import findAwsSdk from './findAwsSdk'

AWSMock.setSDK(findAwsSdk(__dirname))

export function sendMessageMock() {
  AWSMock.mock('SQS', 'sendMessage', (params: {
    MessageBody: string,
    QueueUrl: string,
    MessageGroupId: string
  }, callback: Function) => {
    return callback(null, {})
  })
}

export function sendMessageUnMock() {
  AWSMock.restore('SQS', 'sendMessage')
}

export function sendMessageBatchMock() {
  type Entry = {
    Id: any
    MessageBody: string
    MessageGroupId: string
  }

  AWSMock.mock('SQS', 'sendMessageBatch', (params: {
    Entries: Entry[],
    QueueUrl: string,
  }, callback: Function) => {
    return callback(null, {})
  })
}

export function sendMessageBatchUnMock() {
  AWSMock.restore('SQS', 'sendMessageBatch')
}
