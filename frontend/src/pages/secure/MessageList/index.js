import React, {useEffect, useState} from 'react'
import {Badge, Table} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import MessagesService from '../../../services/messages'
import {Header} from '../../../shared/Header'

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
            <Badge variant={statusName.css}>
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
                {messages.length === 0 &&
                    <RenderEmptyRow />
                }
                {messages.length > 0 && messages.map((item) =>
                    <RenderLine key={item.id} message={item} />
                    )}
                </tbody>
            </Table>
        )
    }

    useEffect(() => {
        async function getAllMessages () {
            const service = new MessagesService()
            const result = await service.getAll()

            setMessages(result)
            setIsLoading(false)
        }

        getAllMessages()
    }, [])

    return (
        <p>
            <Header />

            {isLoading
                ? <p>Carregando</p>
                : <RenderTable messages={messages}/>
            }
        </p>
    )

}