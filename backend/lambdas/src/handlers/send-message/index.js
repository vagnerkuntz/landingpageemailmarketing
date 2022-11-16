const fetch = require('node-fetch')
const parseMessages  = require('../../../lib/aws-parse-sqs.js')
const sign = require('../../../lib/ms-auth.js')

/**
 * Está função deve receber um payload da fila
 * Gerar um JWT com a secret das variáves de ambiente
 * Realizar uma chamada para o backend enviando o jwt + payload
 * O retorno desta chama será um 202
 */

async function main(event) {
  try {
    const isSQSMessage = Boolean(event.Records)
    if (isSQSMessage) {
      const payloadParsed = await parseMessages.parseMessages(event)
      const payload = payloadParsed[0]
      const msJWT = await sign.sign(payload)
      const url = `${process.env.MS_URL_MESSAGES}/messages/sending`

      const checkStatus = (res) => {
        if (res.ok) {
          // qualquer status >= 200 e < 300
          return res
        } else {
          throw Error(res.statusText)
        }
      }

      fetch(url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': msJWT
        }
      })
        .then(checkStatus)
        .then((res) => {
          return {
            statusCode: 200,
            body: JSON.stringify(res)
          }
        })
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error })
    }
  }
}

module.exports.sendMessage = main;