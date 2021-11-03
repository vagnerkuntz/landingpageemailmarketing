import React from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BoxContent, BoxForm } from "./styles";

//  import Logo from '../../../assets/images/logo.png';

class SignIn extends React.Component {
  handleSignIn = async (event) => {
    event.preventDefault();
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
                  <Form.Control type="email" placeholder="Digite seu e-mail" />
                </Form.Group>
                <Form.Group controlId="passwordGroup">
                  <Form.Label>Senha:</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                  />
                </Form.Group>
                <Button block="block" variant="secondary" type="submit">
                  Fazer Login
                </Button>
              </Form>

              <BoxContent>
                <p>
                  Ainda não possui cadastro?{" "}
                  <Link className="button" to="/signup">
                    Cadastre-se!
                  </Link>
                </p>
              </BoxContent>
            </BoxForm>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SignIn;
