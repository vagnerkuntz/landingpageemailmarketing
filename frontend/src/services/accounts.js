import baseAPI from "./api";
import baseURLs from "../configs/baseURLs";

class AccountsService {
  constructor() {
    this.api = baseAPI(baseURLs.API_ACCOUNTS);
  }

  async signup(userModel) {
    const response = await this.api.post("accounts", userModel);
    return response;
  }

  async login(email, password) {
    const response = await this.api.post("accounts/login", { email, password });
    return response;
  }
}

export default AccountsService;
