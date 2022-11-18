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

      const response = await fetch(url, {
        method: 'post',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': msJWT
        }
      })
      const data = await response

      if (data.status === 202) {
        return {
          statusCode: 200,
          body: JSON.stringify(data)
        }
      }

      return {
        error: data.statusText
      }
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