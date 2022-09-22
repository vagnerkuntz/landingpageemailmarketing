import React from "react";

import AccountsService from "../../../services/accounts";
import { login } from "../../../services/auth";

import HeaderLogin from "../HeaderLogin";
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

class SignIn extends React.Component {
  state = {
    email: "",
    password: "",
    error: "",
  };

  handleSignIn = async (event) => {
    event.preventDefault();

    const { email, password } = this.state;

    if (!email || !password) {
      this.setState({ error: "Preencha todos os campos" });
    } else {
      try {
        const service = new AccountsService();

        const response = await service.login(email, password);
        login(response.data.token);

        this.props.history.push("/");
      } catch (error) {
        this.setState({ error: "Houve um erro ao fazer login" });
      }
    }
  };

  render() {
    return (
      <Container>

        <HeaderLogin />

        <ElipseGreen />
        <ElipsePurple />

        <Img src={CirculoFundo} alt="" />

        <Form>
          <Input type="text" id="email" placeholder="E-mail" />

          <br />

          <Input type="password" id="password" placeholder="Senha" />

          <ButtonWrapper>
            <Button>Entrar</Button>
          </ButtonWrapper>
          <LinkCadastrese href="/signup">
            Cadastre-se
          </LinkCadastrese>
        </Form>

      </Container>
    );
  }
}

export default SignIn;
