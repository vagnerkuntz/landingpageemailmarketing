import React, {useState} from "react";

import AccountsService from "../../../services/accounts";
import { login } from "../../../services/auth";

import { useNavigate } from "react-router-dom";

import {HeaderLogin} from "../../../shared/HeaderLogin";

import {
  Container,
  ElipseGreen,
  ElipsePurple,
  Form,
  Input,
  ButtonWrapper,
  Button,
  LinkCadastrese,
  Img
} from './styles'

import CirculoFundo from '../../../assets/images/circulo_fundo_login.svg'
import {Alert} from "react-bootstrap";

export function SignIn () {
  const navigate = useNavigate();

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSignIn (event) {
    event.preventDefault();

    if (!email || !password) {
      setError('Preencha todos os campos')
    } else {
      try {
        const service = new AccountsService();

        const response = await service.login(email, password);
        login(response.data.token);

        navigate("/dashboard")
      } catch (error) {
        setError(error);
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

      <Form onSubmit={handleSignIn}>
        {error && renderError()}

        <Input
          type="text"
          id="email"
          placeholder="E-mail"
          onChange={e => setEmail(e.target.value)}
        />

        <br />

        <Input
          type="password"
          id="password"
          placeholder="Senha"
          onChange={e => setPassword(e.target.value)}
        />

        <ButtonWrapper type="submit">
          <Button>Entrar</Button>
        </ButtonWrapper>
        <LinkCadastrese href="/signup">
          Cadastre-se
        </LinkCadastrese>
      </Form>

    </Container>
  )
}
