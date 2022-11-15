import React, {useState} from 'react'
import { Container, Col, Row, Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../../../shared/Header'

import SettingsService from '../../../services/settings'

export function SettingsEmailAdd () {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit (event) {
    event.preventDefault()
    setError('')

    setIsLoading(true)

    if (name === '' || email === '') {
      setError('Preencha todos os campos')
    }

    try {
      const service = new SettingsService()
      await service.addAccountEmail({ name, email })
      navigate('/settings')
    } catch (e) {
      if (e.response.data.message) {
        setError(e.response.data.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <Container>
        <h4>Adicionar seu remetente</h4>
        <p>Informe o nome e o e-mail do remetente para adicionar.</p>
        <p>Você receberá um e-mail da AWS com um link para confirmar o e-mail, clique no link para ativar.</p>

        <br />

        {error !== '' ? <Alert variant="danger" className="w-50">{error}</Alert> : null}

        <Row>
          <Col lg={6} sm={12}>
            <Form onSubmit={handleSubmit}>
              <Form.Label>Nome:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Informe o nome"
                className="mb-2"
                required
                onChange={e => setName(e.target.value)}
              />

              <Form.Label>E-mail:</Form.Label>
              <Form.Control
                type="text"
                placeholder="email@email.com"
                className="mb-4"
                required
                onChange={e => setEmail(e.target.value)}
              />

              <div className="d-flex justify-content-between">
                <Button variant="primary" type="submit">Adicionar E-mail</Button>
                <Link className="btn btn-default" to={'/settings'}>
                  Voltar
                </Link>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}