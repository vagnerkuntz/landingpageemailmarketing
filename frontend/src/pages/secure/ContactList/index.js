import React, {useEffect, useState} from "react";
import { Container, Table, Row, Col } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

import { Header } from "../../../shared/Header";

import ContactsService from "../../../services/contacts";

function RenderLine({ contact }) {
  const { pathname } = useLocation();

  return (
    <tr key={contact.id}>
      <td>{contact.name}</td>
      <td>
        <Link to={`/contacts/${contact.id}`}>{contact.email}</Link>
      </td>
    </tr>
  );
}

function RenderEmptyRow() {
  return (
    <tr>
      <td colSpan="2">Nenhum contato encontrado</td>
    </tr>
  );
}

function RenderTable({ contacts }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Nome</th>
          <th>E-mail</th>
        </tr>
      </thead>
      <tbody>
        {contacts.map((item) => (
          <RenderLine key={item.id} contact={item} />
        ))}
      </tbody>
    </Table>
  );
}

export function ContactsList () {
  const [isLoading, setIsLoading] = useState(true)
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    async function getContacts () {
      const service = new ContactsService();
      const result = await service.getAll();

      setIsLoading(false)
      setContacts(result)
    }

    getContacts()
  }, [])

  return (
    <>
      <Header />
      <Container>
        <Row>
          <Col>
            <h3>Contatos</h3>
          </Col>
          <Col>
            <Link
              className="btn btn-success float-right"
              to="/contacts/add"
            >
              Adicionar contato
            </Link>
          </Col>
          <p>Relação de contatos cadastrados.</p>

          {contacts.length === 0 && <RenderEmptyRow />}
          {!isLoading && <RenderTable contacts={contacts} />}
        </Row>
      </Container>
    </>
  );

}

