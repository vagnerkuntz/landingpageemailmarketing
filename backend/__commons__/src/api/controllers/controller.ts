import { Response } from 'express'
import { TokenProps } from '../auth'

function getToken(res: Response) {
  const payload = res.locals.payload as TokenProps
  if (!payload || !payload.accountId) {
    return res.sendStatus(401)
  } else {
    return payload
  }
}

export default { getToken }