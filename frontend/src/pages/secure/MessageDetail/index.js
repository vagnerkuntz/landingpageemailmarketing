import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Badge, Button } from 'react-bootstrap'
import { Header } from '../../../shared/Header'

import MessageService from '../../../services/messages'
import SettingsService from '../../../services/settings'

function RenderMessageStatus ({ status }) {
  let statusName = {}

  switch (status) {
    case 100:
      statusName = {
        title: 'CRIADA',
        css: 'primary'
      }
      break
    case 150:
      statusName = {
        title: 'AGENDADA',
        css: 'info'
      }
      break
    case 200:
      statusName = {
        title: 'ENVIADA',
        css: 'success'
      }
      break
    case 300:
      statusName = {
        title: 'CRIADA',
        css: 'secondary'
      }
      break
    default:
      statusName = {
        title: 'INDEFINIDO',
        css: 'light'
      }
      break
  }

  return (
    <Badge pill bg={statusName.css}>
      {statusName.title}
    </Badge>
  )
}

function RenderMessage ({ message }) {
  return (
    <>
      {message.status ? <RenderMessageStatus status={message.status} /> : null}

      <p>
        <strong>Assunto:</strong><br />
        {message.subject}
      </p>
      <p>
        <strong>E-mail do remetente:</strong><br />
        {message.fromName} ({message.fromEmail})
      </p>
      <p>
        <strong>Conteúdo:</strong><br />
        {message.body}
      </p>
    </>
  )
}

export function MessageDetail() {
  const navigate = useNavigate()
  const { messageId } = useParams()

  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState(null)

  async function getOneAccount () {
    setIsLoading(true)

    try {
      const messageService = new MessageService()
      const settingsService = new SettingsService()

      const message = await messageService.getOne(messageId)
      const {
        name: fromName,
        email: fromEmail
      } = await settingsService.getOneAccountEmail(message.accountEmailId)

      setMessage({ ...message, fromName, fromEmail })
    } catch (e) {
      console.log('getOneAccount', e)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSendMessage (messageId) {
    setIsSending(true)

    try {
      const service = new MessageService()
      await service.send(messageId)
      navigate('/messages')
    } catch (e) {
      console.log('handleSendMessage', e)
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    void getOneAccount()
  }, [])

  return (
    <>
      <Header />
      <Container>
        <h3>Detalhes da mensagem</h3>

        {isLoading ? <p>Carregando...</p> : (
          <>
            <RenderMessage message={message} />
            <Button
              disabled={isSending}
              variant="primary"
              onClick={() => handleSendMessage(message.id)}
            >
              {isSending ? 'Enviando...' : 'Enviar mensagem'}
            </Button>
          </>
        )}
      </Container>
    </>
  )
}