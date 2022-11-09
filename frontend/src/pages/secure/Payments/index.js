import React, { useState } from 'react'
import { Container, Button } from 'react-bootstrap'

import { Header } from '../../../shared/Header'

import PaymentService from '../../../services/payment'

export function Payments () {
  const [isLoading, setIsLoading] = useState(false)

  async function handleCheckout () {
    try {
      setIsLoading(true)

      const payment = new PaymentService()
      const result = await payment.checkout({
        items: [
          {
            id: 1,
            quantity: 2
          },
          {
            id: 2,
            quantity: 3
          }
        ]
      })

      console.log('result', result)

      if (result.data.url) {
        if (typeof window !== 'undefined') {
          window.open(result.data.url, '_blank')
        }
      }

      setIsLoading(false)
    } catch (e) {
      console.log('e', e)
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <Container>
        <h1>Efetuar a compra</h1>

        <Button
          variant="info"
          disabled={isLoading}
          onClick={!isLoading ? handleCheckout : null}
        >
          {isLoading ? 'Loading…' : 'Comprar'}
        </Button>
      </Container>
    </>
  )
}
