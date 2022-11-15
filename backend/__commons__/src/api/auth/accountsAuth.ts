import jwt, { VerifyOptions } from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

const publicKey = fs.readFileSync(path.join(findKeysPath(__dirname), 'public.key'), 'utf8')
const jwtAlgorithm = 'RS256'

function findKeysPath(currentPath: string): string {
  const keysPath = path.join(currentPath, 'keys')

  if (fs.existsSync(keysPath)) {
    return keysPath
  } else {
    return findKeysPath(path.join(currentPath, '..'))
  }
}

export type TokenProps = {
  accountId: number
  jwt?: string
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

export default { verifyToken, findKeysPath }
