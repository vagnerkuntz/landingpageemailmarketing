import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch,
} from "react-router-dom";

function Home() {
  return (
    <div>
      <Menu />
      <h2>Home</h2>
    </div>
  );
}

function Contacts() {
  let { path, url } = useRouteMatch();

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

      <Switch>
        <Route exact path={path} />
        <Route path={`${path}/:contactId`}>
          <Contact />
        </Route>
      </Switch>
    </div>
  );
}

function Contact() {
  let { contactId } = useParams();

  return (
    <div>
      <h3>Contato {contactId}</h3>
    </div>
  );
}

function Signin() {
  return (
    <div>
      <h2>Login</h2>
    </div>
  );
}

function Signup() {
  return (
    <div>
      <h2>Cadastro</h2>
    </div>
  );
}

function Messages() {
  let { path, url } = useRouteMatch();

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

      <Switch>
        <Route exact path={path} />
        <Route path={`${path}/:messageId`}>
          <Message />
        </Route>
      </Switch>
    </div>
  );
}

function Message() {
  let { messageId } = useParams();

  return (
    <div>
      <h3>Mensagem {messageId}</h3>
    </div>
  );
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
  );
}

export default function Routes() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/signin">
            <Signin />
          </Route>
          <Route path="/signup">
            <Signup />
          </Route>
          <Route path="/contacts">
            <Contacts />
          </Route>
          <Route path="/messages">
            <Messages />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
