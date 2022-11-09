import axios from 'axios'
import { getToken } from './auth'

const baseApi = (baseURL) => {
  const api = axios.create({
    baseURL,
  })

  api.interceptors.request.use(async (config) => {
    const token = await getToken()

    if (token) {
      config.headers['x-access-token'] = token
    }

    return config
  })

  // Response interceptor for API calls
  api.interceptors.response.use((response) => {
    console.log('response', response)
    return response
  }, async function (error) {
    console.log('error', error)
    if (error.response.status === 401) {
      console.log('xxxxxx')
    }
    // const originalRequest = error.config;
    // if (error.response.status === 403 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    //   const access_token = await refreshAccessToken();
    //   axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
    //   return axiosApiInstance(originalRequest);
    // }
    // return Promise.reject(error);
  })

  console.log('api', api)

  return api
}

export default baseApi
