import React from 'react';
import { Navigate } from 'react-router-dom'

const PrivateRoutes = ({ children }) => {
   const token = localStorage.getItem("user");

   return token ? children : <Navigate to="/"></Navigate>
};

export default PrivateRoutes;