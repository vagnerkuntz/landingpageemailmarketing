import react from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { withRouter } from "react-router-dom";

import { Header, Logo } from "./styles";

import { logout } from "../../services/auth";

//import IconeLogo from '../../images/icone.png';

function MainMenu({ history }) {
  async function handleLogout() {
    await logout();
    history.push("/");
  }

  return (
    <Header>
      <Navbar>
        <Container>
          <Navbar.Brand href="/">
            <Logo>LPEM</Logo>
          </Navbar.Brand>
          <Nav>
            <Nav.Link href="/contacts">Contatos</Nav.Link>
            <Nav.Link href="/messages">Mensagens</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </Header>
  );
}
