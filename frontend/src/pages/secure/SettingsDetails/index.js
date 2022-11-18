import React, { useEffect, useState } from 'react'
import { Container, Col, Row, Table, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Header } from '../../../shared/Header'

import SettingsService from '../../../services/settings'

export function SettingsDetailsPage () {
  const service = new SettingsService()

  const [dnsSettings, setDnsSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  function RenderEmails ({ records }) {
    return (
      <>
        {records.length === 0 ? <RenderEmptyRow message="Nenhum e-mail criado" /> : records.map((item, index) => (
            <tr key={index}>
              <td>
                {item.email}
                {(item.verified ? <Badge className="mx-2" bg="success">E-mail verificado</Badge> : <Badge className="mx-2" bg="warning">Aguardando verificação</Badge>)}
              </td>
            </tr>
          )
        )}
      </>
    )
  }

  function RenderLines ({ records }) {
    return (
      <>
        {records.dnsRecords.length === 0 ? <RenderEmptyRow message="Nenhum DNS disponível" /> : null}
        {records.verified ? <RenderVerifiedRow /> :
          records.dnsRecords.map((item, index) => (
            <tr key={index}>
              <td>{item.type}</td>
              <td>{item.name}</td>
              <td>{(item.priority ? (`${item.value} - Prioridade ${item.priority}`) : item.value)}</td>
            </tr>
          ))
        }
      </>
    )
  }

  function RenderEmptyRow ({ message }) {
    return (
      <tr>
        <td colSpan={3}>{message}</td>
      </tr>
    )
  }

  function RenderVerifiedRow () {
    return (
      <tr>
        <td colSpan={3}>Configurações realizadas com sucesso</td>
      </tr>
    )
  }

  function RenderLoaderRow () {
    return (
      <tr>
        <td colSpan={3}><Loader /></td>
      </tr>
    )
  }

  function Loader () {
    return (
      <>
        Carregando...
      </>
    )
  }

  async function getService () {
    try {
      const { DKIM, SPF, Domain, EmailAddress } = await service.get()
      setDnsSettings({ DKIM, SPF, Domain, EmailAddress  })
    } catch (e) {
      console.log('getservice error', e)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    void getService()
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

        <br/>

        {isLoading && <p>carregando...</p>}
        <h4>Configurações no DNS</h4>
        <h5>Entradas TXT</h5>
        <p>Crie uma entrada TXT com a seguinte informação:</p>

        <Table bordered striped hover>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Nome</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <RenderLoaderRow /> : null}
            {!isLoading ? <RenderLines records={dnsSettings.Domain} /> : null}
          </tbody>
        </Table>

        <h5>DKIM</h5>
        <p>Adicione uma entrada DKIM no seu provedor a seguinte informação:</p>

        <Table bordered striped hover>
          <thead>
          <tr>
            <th>Tipo</th>
            <th>Nome</th>
            <th>Valor</th>
          </tr>
          </thead>
          <tbody>
          {isLoading ? <RenderLoaderRow /> : null}
          {!isLoading ? <RenderLines records={dnsSettings.DKIM} /> : null}
          </tbody>
        </Table>

        <h5>SPF</h5>
        <p>Crie ou atualize a entrada SPF no seu DNS. Para a configuração MX adicione a prioridade informada:</p>

        <Table bordered striped hover>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Nome</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <RenderLoaderRow /> : null}
            {!isLoading ? <RenderLines records={dnsSettings.SPF} /> : null}
          </tbody>
        </Table>

        <h4>Endereços de e-mail</h4>
        <p>Lista de endereços de e-mail configurado como remetente para envio.</p>

        <Link className="btn btn-success mb-4" to={'/settings/email/add'}>
          Adicionar remetente
        </Link>

        <Table bordered striped hover>
          <thead>
            <tr>
              <th>Endereço de E-mail</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <RenderLoaderRow /> : null}
            {!isLoading ? <RenderEmails records={dnsSettings.EmailAddress} /> : null}
          </tbody>
        </Table>
      </Container>
    </>
  )
}