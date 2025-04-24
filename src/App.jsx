import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Home from './pages/dashboard/Home';
import Inventario from './pages/dashboard/Inventario';
import Clientes from './pages/dashboard/Clientes';
import PrivateRoute from './components/PrivateRoute';
import Ventas from './pages/dashboard/Ventas';
import Reportes from './pages/dashboard/Reportes';
import RecursosHumanos from './pages/dashboard/RecursosHumanos';
import RegistroUsuario from './pages/dashboard/RegistroUsuario'; // nuevo

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      axios.get('http://localhost:3001/api/user', {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((response) => setUser(response.data))
        .catch((err) => {
          console.error('Error al obtener el usuario:', err);
          localStorage.removeItem('authToken');
          setToken(null);
        });
    }
  }, []);

  const handleLogin = (credentials) => {
    axios.post('http://localhost:3001/api/login', credentials)
      .then((response) => {
        const { token, userData } = response.data;
        localStorage.setItem('authToken', token);
        setToken(token);
        setUser(userData);
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error('Error al realizar login:', err);
        alert('Credenciales incorrectas');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  return (
    <Routes>
      <Route path="/" element={<Login onLoginSuccess={handleLogin} />} />
      <Route element={<PrivateRoute user={user} />}>
        <Route path="/dashboard" element={<DashboardLayout user={user} onLogout={handleLogout} />}>
          <Route index element={<Home />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="recursos-humanos" element={<RecursosHumanos />} />
          <Route path="reportes" element={<Reportes />} />

         
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
