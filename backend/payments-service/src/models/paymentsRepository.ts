import PaymentsModel  from "./paymentsModel"
import { IPayments } from "./payments"

async function add(payments: IPayments, accountId: number) {
    payments.accountId = accountId
    const result = await PaymentsModel.create(payments)
    payments.id = result.id
    return payments
}

export default { add }