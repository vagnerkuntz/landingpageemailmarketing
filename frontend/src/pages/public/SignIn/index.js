import React from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import { BoxContent, BoxForm } from "../../../shared/styles";

import api from "../../../services/api";
import { login } from "../../../services/auth";

//  import Logo from '../../../assets/images/logo.png';

class SignIn extends React.Component {
  state = {
    email: "",
    password: "",
    error: "",
  };

  handleSignIn = async (event) => {
    event.preventDefault();

    const { email, password, error } = this.state;

    if (!email || !password) {
      this.setState({ error: "Preencha todos os campos" });
      return;
    } else {
      try {
        const response = await api.post("accounts/login", {
          email,
          password,
        });
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
        <Row className="justify-content-md-center">
          <Col xs={12} md={6}>
            <BoxContent>logo aqui</BoxContent>
            <BoxForm>
              <h2>Login</h2>
              <p>Informe seus dados para efetuar o login</p>

              <Form onSubmit={this.handleSignIn}>
                <Form.Group controlId="emailGroup">
                  <Form.Label>E-mail:</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Digite seu e-mail"
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="passwordGroup">
                  <Form.Label>Senha:</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                  />
                </Form.Group>
                <div className="d-grid mt-2">
                  <Button variant="secondary" size="lg" type="submit">
                    Fazer Login
                  </Button>
                </div>
              </Form>
            </BoxForm>

            <BoxContent>
              <p>
                Ainda não possui cadastro?{" "}
                <Link className="button" to="/signup">
                  Cadastre-se!
                </Link>
              </p>
            </BoxContent>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(SignIn);
