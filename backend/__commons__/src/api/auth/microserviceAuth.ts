import jwt from 'jsonwebtoken'

const SECRET: string = `${process.env.MS_JWT_SECRET}`
const EXPIRATION: number = parseInt(`${process.env.MS_JWT_EXPIRES}`)

function sign (token: any) {
  try {
    return jwt.sign(token, SECRET, {
      expiresIn: EXPIRATION
    })
  } catch (e) {
    console.log('sign:', e)
    return null
  }
}

function verify (token: any) {
  try {
    return jwt.verify(token, SECRET)
  } catch (e) {
    console.log('verify: ', e)
    return null
  }
}

export default {
  sign,
  verify
}