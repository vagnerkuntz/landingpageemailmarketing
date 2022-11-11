import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { Header } from '../../../shared/Header'

import { logout } from '../../../services/auth'

export function Dashboard () {
    const navigate = useNavigate()

    async function handleLogout() {
        await logout()
        navigate('/signin')
    }

  return (
      <>
          <Header />
          <Container>
              <h2>Dashboard</h2>
              <p>Aqui podemos listar os últimos envios, contatos adicionados ou estatísticas.</p>

              <a onClick={handleLogout}>Sair</a>
          </Container>
      </>
  )
}

