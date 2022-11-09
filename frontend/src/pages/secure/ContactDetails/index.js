import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { Header } from '../../../shared/Header'
import ContactsService from '../../../services/contacts'

function RenderContact({ contact }) {
  return (
    <>
      <p>Nome: {contact.name}</p>
      <p>Email: {contact.email}</p>
      <p>Telefone: {contact.phone}</p>
    </>
  )
}

export function ContactDetails () {
  const [contact, setContact] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  async function getContact(contactId) {
    const service = new ContactsService()
    const result = await service.getOne(contactId)

    setIsLoading(false)
    setContact(result)
  }

  useEffect(() => {
    const {
      params: { contactId },
    } = this.props.match

    getContact(contactId)
  }, [])


  return (
    <>
      <Header />

      <Container>
        <h3>Detalhes do Contato</h3>
        {isLoading ? (
          <p>Carregando...</p>
        ) : (
          <RenderContact contact={contact} />
        )}
      </Container>
    </>
  )
}
