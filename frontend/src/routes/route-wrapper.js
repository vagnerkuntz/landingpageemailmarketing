import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { isAuthenticated } from '../services/auth'

const RouteWrapper = () => {
  return isAuthenticated() ?
    <Outlet />
    :
    <Navigate to="signin" replace={true} />
}



export default RouteWrapper
