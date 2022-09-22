import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';

import InputGroup from 'react-bootstrap/InputGroup';
import { BsSearch } from 'react-icons/bs';

import {ReactComponent as Logo} from '../../../assets/images/logo.svg'

import { Bg } from './styles'

function HeaderLogin () {
  return (
    <Bg>
      <Navbar collapseOnSelect expand="lg" fixed="top" style={{ background: 'rgba(31, 29, 43, 0.8)' }}>
        <Container>
          <Navbar.Brand href="/">
            <Logo />
          </Navbar.Brand>

        </Container>
      </Navbar>
    </Bg>
  );
}

export default HeaderLogin;
