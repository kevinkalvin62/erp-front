import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ user }) => {
  // Verifica si el usuario está autenticado y tiene un rol 1 o 2
  if (!user || (![1, 2].includes(user.role_id))) {
    return <Navigate to="/" />; // Redirige al login si no está autenticado o no tiene el rol adecuado
  }

  return <Outlet />; // Si el usuario tiene rol adecuado, permite el acceso a las rutas protegidas
};

export default PrivateRoute;
