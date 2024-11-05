
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ isLoggedIn, children }) => {
  console.log(children);
  
  return isLoggedIn ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
