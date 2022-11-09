import baseAPI from './api'
import baseURLs from '../configs/baseURLs'

class AccountsService {
  constructor() {
    this.api = baseAPI(baseURLs.API_ACCOUNTS)
  }

  async signup(userModel) {
    return await this.api.post('/accounts', userModel)
  }

  async login(email, password) {
    return await this.api.post('/accounts/login', {email, password})
  }
}

export default AccountsService
