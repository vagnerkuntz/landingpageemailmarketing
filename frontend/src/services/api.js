import axios from 'axios'
import { getToken } from './auth'

const baseApi = (baseURL) => {
  const api = axios.create({
    baseURL,
  })

  api.interceptors.request.use((config) => {
    const token = getToken()

    if (token) {
      config.headers['x-access-token'] = token
    }

    return config
  })

  api.interceptors.response.use((response) => {
    return response
  }, async function (error) {
    console.log('error interceptors response', error)

    if (error.response.data.message) {
      // return error.response.data.message
      return Promise.reject(error)
    }

    if (error.response.status === 401) {
      window.location.href = '/signin/'
    }
  })

  return api
}

export default baseApi
