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
    if (error.response.status === 401) {
      window.location.href = '/signin'
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

  return api
}

export default baseApi
