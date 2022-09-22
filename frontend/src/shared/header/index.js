import { useNavigate } from "react-router-dom";

import { Container, Navbar, Nav } from "react-bootstrap";

import { Header, Logo } from "./styles";

import { logout } from "../../services/auth";

//import IconeLogo from '../../images/icone.png';

function MainMenu() {
  let navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
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
            <Nav.Link href="/payments">Compras</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={handleLogout}>Sair</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </Header>
  );
}

export default MainMenu;
