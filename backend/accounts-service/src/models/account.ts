import { IAccountEmail } from './accountEmail'
import { AccountStatus } from './accountStatus'
import { AccountSettings } from 'commons/services/emailService'

export interface IAccount {
  id?: number
  name: string
  email: string
  password: string
  status?: AccountStatus
  domain: string
  settings?: AccountSettings
  accountEmails?: IAccountEmail[]
}
