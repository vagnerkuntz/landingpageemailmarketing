import jwt, { VerifyOptions } from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

const publicKey = fs.readFileSync(path.resolve(__dirname, '..', '..', 'keys', 'public.key'), 'utf8')
const jwtAlgorithm = 'RS256'

export type TokenProps = {
  accountId: number
}

async function verifyToken(token: string) {
  try {
    // assimétrico passa a chave pública
    const decoded: TokenProps = await jwt.verify(token, publicKey, {
      algorithm: [jwtAlgorithm]
    } as VerifyOptions) as TokenProps

    return { accountId: decoded.accountId }
  } catch(error) {
    console.log(`verifyToken: ${error}`)
    return null
  }
}

export default { verifyToken }
