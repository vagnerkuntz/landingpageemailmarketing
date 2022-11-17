import {EmailSetting} from 'commons/services/emailService'

export interface IAccountEmail {
    id?: number
    accountId: number
    name: string
    email: string
    settings?: EmailSetting
}