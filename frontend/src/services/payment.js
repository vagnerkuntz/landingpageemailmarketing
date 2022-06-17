import baseAPI from "./api";
import baseURLs from "../configs/baseURLs";

class PaymentService {
    constructor() {
        this.api = baseAPI(baseURLs.API_PAYMENTS);
    }

    async checkout(paymentModel) {
        const response = await this.api.post("checkout", paymentModel);
        return response;
    }
}

export default PaymentService;
