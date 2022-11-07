import {EmailSetting} from 'commons/clients/emailService'

export interface IAccountEmail {
    id?: number
    accountId: number
    name: string
    email: string
    settings?: EmailSetting
}