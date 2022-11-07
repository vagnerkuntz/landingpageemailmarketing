import { AccountStatus } from './accountStatus'
import {AccountSettings} from 'commons/clients/emailService'

export interface IAccount {
  id?: number
  name: string
  email: string
  password: string
  status?: AccountStatus
  domain: string
  settings?: AccountSettings
}
