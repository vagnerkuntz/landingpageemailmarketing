import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
} from "react-router-dom";

import SignInPage from "./../pages/public/SignIn";
import SignUpPage from "./../pages/public/SignUp";

import DashboardPage from "./../pages/secure/Dashboard";
import ContactsListPage from "./../pages/secure/ContactList";
import ContactsAddPage from "./../pages/secure/ContactAdd";

import RoutePrivate from "./route-wrapper";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <RoutePrivate exact path="/" component={DashboardPage} />
        <RoutePrivate exact path="/contacts" component={ContactsListPage} />
        <RoutePrivate exact path="/contacts/add" component={ContactsAddPage} />
        <Route exact path="/signin" component={SignInPage} />
        <Route exact path="/signup" component={SignUpPage} />
      </Switch>
    </Router>
  );
}
