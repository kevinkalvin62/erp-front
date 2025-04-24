import React from 'react';

const Topbar = ({ user, onLogout }) => {
  return (
    <div
      style={{ height: '60px', background: '#007bff', color: '#fff' }}
      className="d-flex justify-content-between align-items-center px-4"
    >
      <h5 className="m-0">ERP | Bienvenido</h5>
      <div className="d-flex align-items-center gap-3">
        <span>{user ? `Usuario: ${user.username}` : ''}</span>
        <button onClick={onLogout} className="btn btn-sm btn-outline-light">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Topbar;
