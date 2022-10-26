import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import {ReactComponent as Logo} from '../../assets/images/logo.svg'

import { Bg } from './styles'

export function HeaderLogin () {
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
