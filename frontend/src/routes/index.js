import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ChooseTheme from "./../pages/public/ChooseTheme";
import DashboardPagePublic from "./../pages/public/Dashboard";
import { SignIn } from "../pages/public/SignIn";
import { SignUp } from "../pages/public/SignUp";

import DashboardPage from "./../pages/secure/Dashboard";
import ContactsListPage from "./../pages/secure/ContactList";
import ContactsAddPage from "./../pages/secure/ContactAdd";
import ContactDetailsPage from "../pages/secure/ContactDetails";
import PaymentsPage from "./../pages/secure/Payments";
import PaymentSuccess from "../pages/secure/Payments/payment_success";
import PaymentCancel from "../pages/secure/Payments/payment_cancel";

import RoutePrivate from "./route-wrapper";


export default function AllRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<ChooseTheme />} />
        <Route exact path="/home" element={<DashboardPagePublic />} />

        <Route exact path="/signin" element={<SignIn />} />
        <Route exact path="/signup" element={<SignUp />} />

        <Route element={<RoutePrivate />}>
          <Route exact path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route element={<RoutePrivate />}>
          <Route exact path="/contacts" element={<ContactsListPage />} />
        </Route>

        <Route element={<RoutePrivate />}>
          <Route exact path="/contacts/add" element={<ContactsAddPage />} />
        </Route>

        <Route element={<RoutePrivate />}>
          <Route
            exact
            path="/contacts/:contactId"
            element={<ContactDetailsPage />}
          />
        </Route>

        <Route element={<RoutePrivate />}>
          <Route exact path="/payments" element={<PaymentsPage />} />
        </Route>

        <Route element={<RoutePrivate />}>
          <Route exact path="/payment_cancel" element={<PaymentCancel />} />
        </Route>

        <Route element={<RoutePrivate />}>
          <Route exact path="/payment_success" element={<PaymentSuccess />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
