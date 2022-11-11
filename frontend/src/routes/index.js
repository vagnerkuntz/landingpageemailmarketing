import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import ChooseTheme from './../pages/public/ChooseTheme'
import { DashboardPagePublic } from '../pages/public/Dashboard'
import { SignIn } from '../pages/public/SignIn'
import { SignUp } from '../pages/public/SignUp'

import { Dashboard } from '../pages/secure/Dashboard'
import { ContactsList } from '../pages/secure/ContactList'

import { MessageList } from '../pages/secure/MessageList'
import { MessageAdd } from '../pages/secure/MessageAdd'
import { MessageDetail } from '../pages/secure/MessageDetail'

import { SettingsDetailsPage } from '../pages/secure/SettingsDetails'

import {ContactAdd} from '../pages/secure/ContactAdd'

import {ContactDetails} from '../pages/secure/ContactDetails'
import {Payments} from '../pages/secure/Payments'
import {PaymentSuccess} from '../pages/secure/Payments/payment_success'
import {PaymentCancel} from '../pages/secure/Payments/payment_cancel'

import RoutePrivate from './route-wrapper'

export default function AllRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<ChooseTheme />} />
        <Route exact path="/home" element={<DashboardPagePublic />} />

        <Route exact path="/signin" element={<SignIn />} />
        <Route exact path="/signup" element={<SignUp />} />

        <Route element={<RoutePrivate />}>
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<RoutePrivate />}>
          <Route exact path="/contacts" element={<ContactsList />} />
        </Route>

        <Route element={<RoutePrivate />}>
          <Route exact path="/messages" element={<MessageList />} />
        </Route>

        <Route element={<RoutePrivate />}>
          <Route exact path="/messages/add" element={<MessageAdd />} />
        </Route>

        <Route element={<RoutePrivate />}>
          <Route exact path="/messages/:messageId" element={<MessageDetail />} />
        </Route>

        <Route element={<RoutePrivate />}>
          <Route exact path="/settings" element={<SettingsDetailsPage />} />
        </Route>

        <Route element={<RoutePrivate />}>
          <Route exact path="/contacts/add" element={<ContactAdd />} />
        </Route>

        <Route element={<RoutePrivate />}>
          <Route path="contacts">
            <Route path=":contactId" element={<ContactDetails />} />
          </Route>
        </Route>

        <Route element={<RoutePrivate />}>
          <Route exact path="/payments" element={<Payments />} />
        </Route>

        <Route element={<RoutePrivate />}>
          <Route exact path="/payment_cancel" element={<PaymentCancel />} />
        </Route>

        <Route element={<RoutePrivate />}>
          <Route exact path="/payment_success" element={<PaymentSuccess />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
