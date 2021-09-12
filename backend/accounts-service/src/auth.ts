import bcrypt from 'bcryptjs'
import jwt, { VerifyOptions } from 'jsonwebtoken'
import fs from 'fs'

const publicKey = fs.readFileSync('./keys/public.key', 'utf8')
const privateKey = fs.readFileSync('./keys/private.key', 'utf8')
const jwtExpires = parseInt(`${process.env.JWT_EXPIRES}`)
const jwtAlgorithm = 'RS256'

function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10)
}

function comparePassword(password: string, hashPassword: string) {
  return bcrypt.compareSync(password, hashPassword)
}

type TokenProps = {
  accountId: number
}

function signToken(accountId: number) {
  const token: TokenProps = { accountId }

  return jwt.sign(token, privateKey, {
    expiresIn: jwtExpires,
    algorithm: jwtAlgorithm
  })
}

async function verifyToken(token: string) {
  try {
    // assimétrico passa a chave pública
    const decoded: TokenProps = await jwt.verify(token, publicKey, {
      algorithm: [jwtAlgorithm]
    } as VerifyOptions) as TokenProps

    return { accountId: decoded.accountId }
  } catch(error) {
    console.log(`verifyToken ${error}`)
    return null
  }
}

export default { hashPassword, comparePassword, signToken, verifyToken }
