import React, { useEffect, useState } from 'react'
import { Alert, Form, Container, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../../../shared/Header'

import MessagesService from '../../../services/messages'
import SettingsService from '../../../services/settings'

export function MessageAdd () {
  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [accountEmailId, setAccountEmailId] = useState('')
  const [emailsFrom, setEmailsFrom] = useState([])
  const [error, setError] = useState('')

  function RenderError () {
    return (
      <Alert variant="danger">{error}</Alert>
    )
  }

  async function handleSave (event) {
    setIsLoading(true)
    event.preventDefault()

    if (!subject || !body || !accountEmailId) {
      setError('Preencha todos os campos')
    } else {
      try {
        const service = new MessagesService()
        await service.add({ subject, body, accountEmailId })
        navigate('/messages')
      } catch (e) {
        setError(e)
      } finally {
        setIsLoading(false)
      }
    }

    setIsLoading(false)
  }

  async function getAllAccountEmail () {
    setIsLoading(true)

    try {
      const service = new SettingsService()
      const result = await service.getAllAccountEmail()
      setEmailsFrom(result)
    } catch (e) {
      console.log('getAllAccountEmail', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void getAllAccountEmail()
  }, [])

  return (
    <>
      <Header />

      <Container>
        <h3>Adicionar mensagem</h3>
        <Form onSubmit={handleSave}>
          {error !== '' ? <RenderError /> : null}

          <Form.Group>
            <Form.Label>Assunto:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Informe o assunto da mensagem"
              onChange={e => setSubject(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Remetente:</Form.Label>
            <Form.Control
              as="select"
              disabled={isLoading}
              value={!isLoading && accountEmailId}
              onChange={e => setAccountEmailId(e.target.value)}
            >
              <option key="0" value="">Selecione</option>
              {!isLoading ? (emailsFrom.map(item => (
                <option key={item.id} value={item.id}>{item.email}</option>
              ))) : null}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Corpo da mensagem:</Form.Label>
            <Form.Control
              type="textarea"
              rows={3}
              placeholder="Digite o conteúdo da mensagem"
              onChange={e => setBody(e.target.value)}
            />
          </Form.Group>

          <div className="mt-2 d-flex justify-content-between">
            <Button variant="primary" type="submit">
              Salvar mensagem
            </Button>

            <Link className="btn btn-light" to="/messages">
              Voltar
            </Link>
          </div>
        </Form>
      </Container>
    </>
  )
}