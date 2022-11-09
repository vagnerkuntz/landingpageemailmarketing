import React, {useEffect, useState} from 'react'

import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'

import { BsSearch } from 'react-icons/bs'

import { Bg } from './styles'
import {getToken} from '../../services/auth'

import Logo from '../../assets/images/logo.svg'

export function Header () {
  const [logged, setLogged] = useState(null)

  useEffect(() => {
    const token = getToken()

    if (token) {
      setLogged(token)
    }
  }, [])

  return (
    <Bg>
      <Navbar collapseOnSelect expand="lg" fixed={logged ? 'none' : 'top'} style={{
        background: 'rgba(31, 29, 43, 0.8)',
        marginBottom: logged ? 20 : 0,
        zIndex: 1
      }}>
        <Container>
          <Navbar.Brand href="/">
            <img src={Logo} alt="" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto w-50">
              <Form className="d-flex w-100">
                <BsSearch color="#fff" style={{ height: 40, marginRight: -30, marginLeft: 20 }}/>
                <Form.Control
                  type="search"
                  placeholder="Procurar items, coleções ou contas"
                  className="me-2"
                  aria-label="Search"
                  style={{
                    backgroundColor: '#fff0',
                    color: '#fff',
                    borderRadius: 30,
                    paddingLeft: 50,
                  }}
                />
              </Form>
            </Nav>
            <Nav>
              {logged
                  ? <>
                    <Nav.Link href="/contacts" style={{color: 'white'}}>Contatos</Nav.Link>
                    <Nav.Link href="/messages" style={{color: 'white'}}>Mensagens</Nav.Link>
                    <Nav.Link href="/settings" style={{color: 'white'}}>Minha Conta</Nav.Link>
                  </>
                  : <>
                    <Nav.Link href="#" style={{ color: 'white' }}>Sobre a empresa</Nav.Link>
                    <Nav.Link href="#" style={{color: 'white'}}>FAQ</Nav.Link>
                    <Nav.Link href="#" style={{color: 'white'}}>Configuração</Nav.Link>
                  </>
              }
              <Nav.Link eventKey={2} href={logged ? '/dashboard' : '/signin'} style={{
                color: 'white',
                border: '1px solid #fff',
                borderRadius: 30,
                width: 100,
                textAlign: 'center',
                marginLeft: 20
              }}>
                {logged ? 'Dashboard' : 'Entrar'}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Bg>
  )
}

