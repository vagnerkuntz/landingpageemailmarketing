import React, {useState} from "react";
import { Link } from "react-router-dom";
import { Header } from "../../../shared/Header";
import { Container, Button, Form, Alert, Row, Col } from "react-bootstrap";
import ContactsService from "../../../services/contacts";

export function ContactAdd () {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSave (event) {
    event.preventDefault();

    if (!name || !email || !phone) {
      setName('Preencha todos os campos')
    } else {
      try {
        const service = new ContactsService();
        await service.add({ name, email, phone });
        navigate("/contacts")
      } catch (error) {
        setError(error)
      }
    }
  }

  function renderError () {
    return (
      <Alert variant="danger">
        <Alert.Heading>Ops! Algo deu errado.</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <>
      <Header />
        <Container>
          <Row>
            <h3>Adicionar contato</h3>
            <p>Informe todos os campos para adicionar o contato</p>
          </Row>
          <Row>
            <Col lg={6} sm={12}>
              {error && renderError()}
              <Form onSubmit={handleSave}>
                <Form.Group>
                  <Form.Label>Nome:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite um nome"
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>E-mail:</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Digite um e-mail"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Telefone:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Digite um telefone"
                    onChange={(e) => setPhone(e.target.value)}
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
    </>
  );
}

