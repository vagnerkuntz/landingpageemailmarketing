export const TOKEN_KEY = 'lpem-token'

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null

export const getToken = async () => localStorage.getItem(TOKEN_KEY)

export const login = (token) => localStorage.setItem(TOKEN_KEY, token)

export const logout = () => localStorage.removeItem(TOKEN_KEY)
