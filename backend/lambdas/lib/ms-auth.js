const jwt = require('jsonwebtoken')

const SECRET = process.env.MS_JWT_SECRET
const EXPIRATION = parseInt(`${process.env.MS_JWT_EXPIRES}`)

async function sign (token) {
  try {
    return await jwt.sign(token, SECRET, {
      expiresIn: EXPIRATION
    })
  } catch (error) {
    console.log(`sign: ${error}`)
    return null
  }
}

module.exports = {
  sign
}