import React, {useEffect, useState} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Container, Badge, Table, Row, Col } from 'react-bootstrap'
import { Header } from '../../../shared/Header'

import MessagesService from '../../../services/messages'

export function MessageList () {
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState([])

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
      <Badge bg={statusName.css}>
        {statusName.title}
      </Badge>
    )
  }

  function RenderEmptyRow() {
    return (
      <tr>
        <td colSpan={2}>Nenhuma mensagem foi adicionada.</td>
      </tr>
    )
  }

  function RenderLine({ message }) {
    return (
      <tr>
        <td>
          <Link to={`/message/${message.id}`}>{message.subject}</Link>
        </td>
        <td>
          <RenderMessageStatus status={message.status}/>
        </td>
      </tr>
    )
  }

  function RenderTable ({ messages }) {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
              <th>Assunto</th>
              <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {messages.length === 0 && <RenderEmptyRow />}
          {messages.length > 0 && messages.map((item) =>
            <RenderLine key={item.id} message={item} />
          )}
        </tbody>
      </Table>
    )
  }

  function RenderButtonAdd () {
    const { pathname } = useLocation()

    return (
      <Link className="btn btn-success float-right" to={`${pathname}/add`}>
        Adicionar mensagem
      </Link>
    )
  }

  async function getAllMessages () {
    setIsLoading(true)

    try {
      const service = new MessagesService()
      const result = await service.getAll()

      setMessages(result)
    } catch (e) {
      console.log('getAllMessages', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void getAllMessages()
  }, [])

  return (
    <>
      <Header />

      <Container>
        <Row>
          <Col>
            <h3>Mensagens</h3>
          </Col>
          <Col>
            <RenderButtonAdd />
          </Col>
          <p>Lista de mensagens enviadas pela ferramenta:</p>
          <RenderTable messages={messages} />
        </Row>
      </Container>
    </>
  )
}