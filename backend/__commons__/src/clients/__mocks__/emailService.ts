import AWSMock from 'aws-sdk-mock'
import findAwsSdk from './findAwsSdk'

AWSMock.setSDK(findAwsSdk(__dirname))

export function getEmailIdentityMock() {
  AWSMock.mock('SESV2', 'getEmailIdentity', (params: {
    EmailIdentity: string
  }, callback: Function) => {
    if (params.EmailIdentity.indexOf('@') !== -1) {
      return callback(null, {
        IdentityType: 'EMAIL',
        FeedbackForwardingStatus: true,
        VerifiedForSendingStatus: false,
        DkimAttributes: {
          SigningEnabled: true,
          Status: 'PENDING',
          Tokens: ['30923kdqdada', 'dok23dk23d', 'd4543fsadasd09dasa'],
          SigningAttributesOrigin: 'AWS_SES'
        },
        MailFromAttributes: {
          MailFromDomain: `lpem.${params.EmailIdentity}`,
          MailFromDomainStatus: 'PENDING',
          BehaviorOnMxFailure: 'USE_DEFAULT_VALUE',
        },
        Policies: {},
        Tags: []
      })
    } else {
      return callback(null, {
        IdentityType: 'DOMAIN',
        FeedbackForwardingStatus: true,
        VerifiedForSendingStatus: false,
        DkimAttributes: {
          SigningEnabled: true,
          Status: 'PENDING',
          Tokens: ['30923kdqdada', 'dok23dk23d', 'd4543fsadasd09dasa'],
          SigningAttributesOrigin: 'AWS_SES'
        },
        MailFromAttributes: {
          MailFromDomain: `lpem.${params.EmailIdentity}`,
          MailFromDomainStatus: 'PENDING',
          BehaviorOnMxFailure: 'USE_DEFAULT_VALUE',
        },
        Policies: {},
        Tags: []
      })
    }
  })
}

export function getEmailIdentityUnMock() {
  AWSMock.restore('SESV2', 'getEmailIdentity')
}

export function createEmailIdentityMock() {
  AWSMock.mock('SESV2', 'createEmailIdentity', (params: {
    EmailIdentity: string
  }, callback: Function) => {
    return callback(null, {
      IdentityType: 'DOMAIN',
      VerifiedForSendingStatus: false,
      DkimAttributes: {
        SigningEnabled: true,
        Status: 'NOT_STARTED',
        Tokens: ['30923kdqdada', 'dok23dk23d', 'd4543fsadasd09dasa'],
        SigningAttributesOrigin: 'AWS_SES'
      }
    })
  })
}

export function createEmailIdentityUnMock() {
  AWSMock.restore('SESV2', 'createEmailIdentity')
}

export function putEmailIdentityMailFromAttributesMock() {
  AWSMock.mock('SESV2', 'putEmailIdentityMailFromAttributes', (params: {
    EmailIdentity: string,
    BehaviorOnMxFailure: string,
    MailFromDomain: string
  }, callback: Function) => {
    return callback(null, {})
  })
}

export function putEmailIdentityMailFromAttributesUnMock() {
  AWSMock.restore('SESV2', 'putEmailIdentityMailFromAttributes')
}

export function getIdentityVerificationAttributesMock() {
  interface IStringArray {
    [index: string]: {}
  }

  AWSMock.mock('SES', 'getIdentityVerificationAttributes', (params: {
    Identities: string[]
  }, callback: Function) => {
    const result = {
      ResponseMetadata: {
        RequestId: 'ad96c9c3-9730-4585-9dff-42e195666593'
      },
      VerificationAttributes: {} as IStringArray
    }

    for (let i = 0; i < params.Identities.length; i++) {
      result.VerificationAttributes[params.Identities[i]] = {
        VerificationStatus: 'Pending',
        VerificationToken: 'daoskdpoakd2923m23409dmalk'
      }
    }

    return callback(null, result)
  })
}

export function getIdentityVerificationAttributesUnMock() {
  AWSMock.restore('SES', 'getIdentityVerificationAttributes')
}

export function deleteEmailIdentityMock() {
  AWSMock.mock('SESV2', 'deleteEmailIdentity', (params: {
    EmailIdentity: string
  }, callback: Function) => {
    return callback(null, {})
  })
}

export function deleteEmailIdentityUnMock() {
  AWSMock.restore('SESV2', 'deleteEmailIdentity')
}

export function sendEmailMock() {
  AWSMock.mock('SESV2', 'sendEmail', (params: {
    Content: {
      Simple: {
        Body: {
          Html: {
            Data: string,
            Charset: string
          }
        },
        Subject: {
          Data: string,
          Charset: string
        }
      }
    },
    Destination: {
      ToAddresses: string[]
    },
    FeedbackForwardingEmailAddress: string,
    FromEmailAddress: string,
    ReplyToAddresses: string[]
  }, callback: Function) => {
    console.log('params.FromEmailAddress.indexOf(\'jest@jest.com\')', params.FromEmailAddress.indexOf('jest@jest.com'))
    if (params.FromEmailAddress.indexOf('jest@jest.com') !== -1) {
      return callback(null, {
        MessageId: '1'
      })
    } else {
      return callback(null, {
        MessageId: null
      })
    }
  })
}

export function sendEmailUnMock() {
  AWSMock.restore('SESV2', 'sendEmail')
}