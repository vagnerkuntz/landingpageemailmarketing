import React, {useState} from 'react'
import { Alert } from 'react-bootstrap'

import AccountsService from '../../../services/accounts'
import { login } from '../../../services/auth'

import {HeaderLogin} from '../../../shared/HeaderLogin'
import {
  Container,
  ElipseGreen,
  ElipsePurple,
  Form,
  Input,
  ButtonWrapper,
  Button,
  Img,
  Voltarlogin
} from './styles'

import CirculoFundo from '../../../assets/images/circulo_fundo_login.svg'
import {useNavigate} from 'react-router-dom'

export function SignUp () {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [domain, setDomain] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignUp (event) {
    event.preventDefault()

    if (!name || !email || !password || !domain) {
      setError('Preencha todos os campos')
    } else {
      try {
        const service = new AccountsService()

        const response = await service.signup({ name, email, password, domain })
        login(response.data.token)

        navigate('/dashboard')
      } catch (error) {
        setError(error)
      }
    }
  }

  function renderError () {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    )
  }

  return (
    <Container>

      <HeaderLogin />

      <ElipseGreen />
      <ElipsePurple />

      <Img src={CirculoFundo} alt="" />

      <Form onSubmit={handleSignUp}>
        {error && renderError()}

        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Name"
          onChange={e => setName(e.target.value)}
        />

        <br />

        <Input
          type="text"
          id="email"
          name="email"
          placeholder="E-mail"
          onChange={e => setEmail(e.target.value)}
        />

        <br />

        <Input
          type="password"
          id="password"
          name="password"
          placeholder="Senha"
          onChange={e => setPassword(e.target.value)}
        />

        <br />

        <Input
          type="text"
          id="domain"
          name="domain"
          placeholder="Domain"
          onChange={e => setDomain(e.target.value)}
        />

        <ButtonWrapper type="submit">
          <Button>Realizar cadastro</Button>
        </ButtonWrapper>

        <Voltarlogin href="/signin">Voltar para o login</Voltarlogin>
      </Form>


    </Container>
  )
}

