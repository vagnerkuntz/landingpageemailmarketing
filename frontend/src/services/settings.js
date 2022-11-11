import baseAPI from './api'
import baseURLs from '../configs/baseURLs'

class SettingsService {
    constructor() {
        // settings fica na api de accounts
        this.api = baseAPI(baseURLs.API_ACCOUNTS)
    }

   // configurações do domínio
   async get () {
       const result = await this.api.get('accounts/settings')
       return result.data
   }

   // adiciona uma conta de e-mail
    async addAccountEmail (accountEmailModel) {
        const result = await this.api.put('accounts/settings/accountEmails', accountEmailModel)
        return result.data
    }

    // retorna uma conta de e-mail
    async getOneAccountEmail (accountEmailId) {
        const result = await this.api.get(`accounts/settings/accountEmails/${accountEmailId}`)
        return result.data
    }

    // retorna todas as contas de e-mail
    async getAllAccountEmail () {
        const result = await this.api.get('accounts/settings/accountEmails')
        return result.data
    }
}

export default SettingsService
