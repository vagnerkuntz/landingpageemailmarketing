import React, { useEffect, useState } from 'react'

import { Container, Col, Row } from 'react-bootstrap'

import { Header } from '../../../shared/Header'

import SettingsService from '../../../services/settings'

export function SettingsDetailsPage () {
    const service = new SettingsService()

    const [dnsSettings, setDnsSettings] = useState(null)
    const [emailSettings, setEmailSettings] = useState([])

    useEffect(() => {
        async function getService () {
            const result = await service.get()
            console.log('result', result)
        }
        getService()
    }, [])

    return (
        <>
            <Header />
            <Container>
                <Row>
                    <Col>
                        <h3>Minha Conta</h3>
                    </Col>
                </Row>
                <p>Para realizar o envio de mensagens, você precisa possuir um domínio associado a sua conta</p>
                <p>Você precisa atualizar seus DNS, adicionando as novas entradas a seguir e adicionar um e-mail para ser o remetente de envio</p>
            </Container>
        </>
    )
}