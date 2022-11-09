import React, {useEffect, useState} from 'react'
import MessagesService from '../../../services/messages'
import {Alert} from 'react-bootstrap'

export function MessageAdd () {
    const [isLoading, setIsLoading] = useState(false)
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')
    const [error, setError] = useState('')

    function RenderError () {
        return (
            <Alert variant="danger">{error}</Alert>
        )
    }

    async function handleSave (event) {
        setIsLoading(true)
        event.preventDefault()

        if (!subject || !body) {
            setError('Preencha todos os campos')
        } else {
            try {
                const service = new MessagesService()
                await service.add({ subject, body })
            } catch (e) {
                setError(e)
            } finally {
                setIsLoading(false)
            }
        }

        setIsLoading(false)
    }

    return (
        <p>
            Adicionar mensage
        </p>
    )
}