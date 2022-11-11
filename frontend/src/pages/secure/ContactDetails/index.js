import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { Header } from '../../../shared/Header'

import ContactsService from '../../../services/contacts'

export function ContactDetails () {
  const { contactId } = useParams()

  const [contact, setContact] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  async function getContact(contactId) {
    try {
      const service = new ContactsService()
      const result = await service.getOne(contactId)
      setContact(result)
    } catch (e) {
      console.log('error getContact::', e)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    getContact(contactId)
  }, [])


  function RenderContact({ contact }) {
    return (
      <>
        <p>Nome: {contact.name}</p>
        <p>Email: {contact.email}</p>
        <p>Telefone: {contact.phone}</p>
      </>
    )
  }

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
