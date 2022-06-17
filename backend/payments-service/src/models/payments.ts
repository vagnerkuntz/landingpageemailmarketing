import { PaymentsStatus } from "./paymentsStatus"

export interface IPayments {
    id?: number
    accountId: number
    status: PaymentsStatus
}