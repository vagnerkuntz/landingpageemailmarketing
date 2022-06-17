import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import SignInPage from "./../pages/public/SignIn";
import SignUpPage from "./../pages/public/SignUp";

import DashboardPage from "./../pages/secure/Dashboard";
import ContactsListPage from "./../pages/secure/ContactList";
import ContactsAddPage from "./../pages/secure/ContactAdd";
import ContactDetailsPage from "../pages/secure/ContactDetails";
import PaymentsPage from "./../pages/secure/Payments";
import PaymentSuccess from "../pages/secure/Payments/payment_success";
import PaymentCancel from "../pages/secure/Payments/payment_cancel";

import RoutePrivate from "./route-wrapper";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <RoutePrivate exact path="/" component={DashboardPage} />
        <RoutePrivate exact path="/contacts" component={ContactsListPage} />
        <RoutePrivate exact path="/contacts/add" component={ContactsAddPage} />
        <RoutePrivate
          exact
          path="/contacts/:contactId"
          component={ContactDetailsPage}
        />
        <RoutePrivate exact path="/payments" component={PaymentsPage}/>
        <RoutePrivate exact path="/payment_cancel" component={PaymentCancel}/>
        <RoutePrivate exact path="/payment_success" component={PaymentSuccess}/>

        <Route exact path="/signin" component={SignInPage} />
        <Route exact path="/signup" component={SignUpPage} />
      </Switch>
    </Router>
  );
}
