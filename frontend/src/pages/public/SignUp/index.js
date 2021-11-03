import React from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import { BoxContent, BoxForm } from "../../../shared/styles";

import api from "../../../services/api";

//  import Logo from '../../../assets/images/logo.png';

class SignUp extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    domain: "",
    error: "",
    isLoading: false,
  };

  handleSignUp = async (event) => {
    event.preventDefault();

    const { name, email, password, domain, isLoading } = this.state;

    if (!name) {
      return this.setState({ error: "Preencha o campo nome" });
    }

    if (!email) {
      return this.setState({ error: "Preencha o campo email" });
    }

    if (!password) {
      return this.setState({ error: "Preencha o campo senha" });
    }

    if (!domain) {
      return this.setState({ error: "Preencha o campo domínio" });
    }

    if (name && email && password && domain) {
      this.setState({ isLoading: true });
      try {
        await api.post("accounts", { name, email, password, domain });
        this.setState({ error: "" });
        this.props.history.push("/signin");
      } catch (err) {
        this.setState({ error: "Ocorreu um erro ao realizar o cadastro" });
      }
      this.setState({ isLoading: false });
    }
  };

  renderError = () => {
    const { error } = this.state;

    if (!error) return null;

    return (
      <Alert variant="danger" onClose={() => this.setState({ error: "" })}>
        {error}
      </Alert>
    );
  };

  render() {
    return (
      <Container>
        <Row className="justify-content-md-center">
          <Col xs={12} md={6}>
            <BoxContent>logo aqui</BoxContent>
            <BoxForm>
              <h2>Cadastro</h2>
              <p>Preencha os campos para criar uma conta </p>

              <Form onSubmit={this.handleSignUp}>
                {this.state.error && this.renderError()}

                <Form.Group controlId="nomeGroup">
                  <Form.Label>Nome:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite seu nome"
                    onChange={(e) => this.setState({ name: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="emailGroup">
                  <Form.Label>E-mail:</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Digite seu e-mail"
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="dominioGroup">
                  <Form.Label>Dominio:</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="Digite seu dominio"
                    onChange={(e) => this.setState({ domain: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="senhaGroup">
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
                    Realizar cadastro
                  </Button>
                </div>
              </Form>
            </BoxForm>
            <BoxContent>
              <Link className="button" to="/signin">
                Já tenho cadastro
              </Link>
            </BoxContent>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(SignUp);
