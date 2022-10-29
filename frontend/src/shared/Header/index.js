import React, {useEffect, useState} from "react";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';

import { BsSearch } from 'react-icons/bs';

import {ReactComponent as Logo} from '../../assets/images/logo.svg'

import { Bg } from './styles'
import {getToken} from "../../services/auth";

export function Header () {
  const [logged, setLogged] = useState(null)

  useEffect(() => {
    const token = getToken()

    if (token) {
      setLogged(token)
    }
  }, [])

  return (
      <p>a</p>
    // <Bg>
    //   <Navbar collapseOnSelect expand="lg" fixed="top" style={{ background: 'rgba(31, 29, 43, 0.8)' }}>
    //     <Container>
    //       <Navbar.Brand href="/">
    //         <Logo />
    //       </Navbar.Brand>
    //       <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    //       <Navbar.Collapse id="responsive-navbar-nav">
    //         <Nav className="me-auto w-50">
    //           <Form className="d-flex w-100">
    //             <BsSearch color="#fff" style={{ height: 40, marginRight: -30, marginLeft: 20 }}/>
    //             <Form.Control
    //               type="search"
    //               placeholder="Procurar items, coleções ou contas"
    //               className="me-2"
    //               aria-label="Search"
    //               style={{
    //                 backgroundColor: "#fff0",
    //                 color: "#fff",
    //                 borderRadius: 30,
    //                 paddingLeft: 50,
    //               }}
    //             />
    //           </Form>
    //         </Nav>
    //         <Nav>
    //           <Nav.Link href="#" style={{ color: 'white' }}>Sobre a empresa</Nav.Link>
    //           <Nav.Link href="#" style={{ color: 'white' }}>FAQ</Nav.Link>
    //           <Nav.Link href="#" style={{ color: 'white' }}>Configuração</Nav.Link>
    //           <Nav.Link eventKey={2} href={logged ? '/dashboard' : '/signin'} style={{
    //             color: 'white',
    //             border: '1px solid #fff',
    //             borderRadius: 30,
    //             width: 100,
    //             textAlign: 'center',
    //             marginLeft: 20
    //           }}>
    //             {logged ? 'Dashboard' : 'Entrar'}
    //           </Nav.Link>
    //         </Nav>
    //       </Navbar.Collapse>
    //     </Container>
    //   </Navbar>
    // </Bg>
  );
}

