import React from "react";
import { Container } from "react-bootstrap";
import Header from "../../../shared/header";
import { PageContent } from "../../../shared/styles";
import ContactsService from "../../../services/contacts";

function RenderContact({ contact }) {
  return (
    <>
      <p>Nome: {contact.name}</p>
      <p>Email: {contact.email}</p>
      <p>Telefone: {contact.phone}</p>
    </>
  );
}

class ContactDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      contact: null,
    };
  }

  async getContact(contactId) {
    const service = new ContactsService();
    const result = await service.getOne(contactId);
    this.setState({
      isLoading: false,
      contact: result,
    });
  }

  async componentDidMount() {
    const {
      params: { contactId },
    } = this.props.match;

    await this.getContact(contactId);
  }

  render() {
    const { isLoading, contact } = this.state;

    return (
      <>
        <Header />
        <PageContent>
          <Container>
            <h3>Detalhes do Contato</h3>
            {isLoading ? (
              <p>Carregando...</p>
            ) : (
              <RenderContact contact={contact} />
            )}
          </Container>
        </PageContent>
      </>
    );
  }
}

export default ContactDetails;
