import React from "react";
import { Link } from "react-router-dom";
import Header from "../../../shared/header";
import { PageContent } from "../../../shared/styles";
import { Container, Button, Form, Alert, Row, Col } from "react-bootstrap";
import ContactsService from "../../../services/contacts";

class ContactAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      phone: "",
      error: "",
      isLoading: false,
    };
  }

  handleSave = async (event) => {
    event.preventDefault();

    const { name, email, phone } = this.state;

    if (!name || !email || !phone) {
      this.setState({ error: "Preencha todos os campos" });
    } else {
      try {
        const service = new ContactsService();
        await service.add({ name, email, phone });
        this.props.history.push("/contacts");
      } catch (error) {
        this.setState({
          error: "Ocorreu um erro durante a criação, tente novamente.",
        });
      }
    }
  };

  renderError = () => {
    const { error } = this.state;

    return (
      <Alert variant="danger">
        <Alert.Heading>Ops! Algo deu errado.</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  };

  render() {
    return (
      <>
        <Header />
        <PageContent>
          <Container>
            <Row>
              <h3>Adicionar contato</h3>
              <p>Informe todos os campos para adicionar o contato</p>
            </Row>
            <Row>
              <Col lg={6} sm={12}>
                {this.state.error && this.renderError()}
                <Form onSubmit={this.handleSave}>
                  <Form.Group>
                    <Form.Label>Nome:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite um nome"
                      onChange={(e) => this.setState({ name: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>E-mail:</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Digite um e-mail"
                      onChange={(e) => this.setState({ email: e.target.value })}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Telefone:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Digite um telefone"
                      onChange={(e) => this.setState({ phone: e.target.value })}
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Adicionar contato
                  </Button>

                  <Link className="btn btn-link" to="/contacts">
                    Voltar
                  </Link>
                </Form>
              </Col>
            </Row>
          </Container>
        </PageContent>
      </>
    );
  }
}

export default ContactAdd;
