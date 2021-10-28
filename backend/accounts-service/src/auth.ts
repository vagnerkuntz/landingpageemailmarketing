import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import authCommons, { TokenProps } from 'commons/api/auth'
import fs from 'fs'
import path from 'path'

const privateKey = fs.readFileSync(path.resolve(__dirname, '../keys/private.key'), 'utf8')
const jwtExpires = parseInt(`${process.env.JWT_EXPIRES}`)
const jwtAlgorithm = 'RS256'

function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10)
}

function comparePassword(password: string, hashPassword: string) {
  return bcrypt.compareSync(password, hashPassword)
}

function signToken(accountId: number) {
  const token: TokenProps = { accountId }

  return jwt.sign(token, privateKey, {
    expiresIn: jwtExpires,
    algorithm: jwtAlgorithm
  })
}

async function verifyToken(token: string) {
  return authCommons.verifyToken(token)
}

export default { hashPassword, comparePassword, signToken, verifyToken }