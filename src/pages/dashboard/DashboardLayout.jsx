import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = ({ user, onLogout }) => {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      onLogout();
    }, 1500);
  };

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      {loggingOut ? (
        <div className="w-100 d-flex justify-content-center align-items-center">
          <h3>Cerrando sesión...</h3>
        </div>
      ) : (
        <>
          <Sidebar user={user} /> {/* 👈 Aquí se pasa el user al Sidebar */}
          <div className="flex-grow-1 d-flex flex-column">
            <Topbar user={user} onLogout={handleLogout} />
            <div className="p-4" style={{ backgroundColor: '#f5f5f5', height: '100%', overflowY: 'auto' }}>
              <Outlet />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;
