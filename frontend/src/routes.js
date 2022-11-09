import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
  useRouteMatch
} from 'react-router-dom'

import { SignIn } from './pages/public/SignIn'
import { SignUp } from './pages/public/SignUp'

function Home() {
  return (
    <div>
      <Menu />
      <h2>Home</h2>
    </div>
  )
}

function Contacts() {
  let { path, url } = useRouteMatch()

  return (
    <div>
      <Menu />
      <h2>Lista contatos</h2>
      <ul>
        <li>
          <Link to={`${url}/1`}>Contato 1</Link>
        </li>
        <li>
          <Link to={`${url}/2`}>Contato 2</Link>
        </li>
        <li>
          <Link to={`${url}/3`}>Contato 3</Link>
        </li>
      </ul>

      <Routes>
        <Route exact path={path} />
        <Route path={`${path}/:contactId`}>
          <Contact />
        </Route>
      </Routes>
    </div>
  )
}

function Contact() {
  let { contactId } = useParams()

  return (
    <div>
      <h3>Contato {contactId}</h3>
    </div>
  )
}

function Messages() {
  let { path, url } = useRouteMatch()

  return (
    <div>
      <Menu />
      <h2>Mensagens</h2>

      <ul>
        <li>
          <Link to={`${url}/1`}>Mensagem enviada 1</Link>
        </li>
        <li>
          <Link to={`${url}/2`}>Mensagem enviada 2</Link>
        </li>
        <li>
          <Link to={`${url}/3`}>Mensagem enviada 3</Link>
        </li>
      </ul>

      <Routes>
        <Route exact path={path} />
        <Route path={`${path}/:messageId`}>
          <Message />
        </Route>
      </Routes>
    </div>
  )
}

function Message() {
  let { messageId } = useParams()

  return (
    <div>
      <h3>Mensagem {messageId}</h3>
    </div>
  )
}

function Menu() {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/contacts">Contatos</Link>
      </li>
      <li>
        <Link to="/messages">Mensagens</Link>
      </li>
      <li>
        <Link to="/signin">Login</Link>
      </li>
      <li>
        <Link to="/signup">Cadastro</Link>
      </li>
    </ul>
  )
}

export default function RoutesComponent() {
  return (
    <BrowserRouter>
        <Routes>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/signin">
            <SignIn />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/contacts">
            <Contacts />
          </Route>
          <Route path="/messages">
            <Messages />
          </Route>
        </Routes>
    </BrowserRouter>
  )
}
