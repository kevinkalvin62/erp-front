import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = ({ user }) => {
  const navigate = useNavigate();
  
  const [productosCount, setProductosCount] = useState(0);
  const [clientesCount, setClientesCount] = useState(0);
  const [empleadosCount, setEmpleadosCount] = useState(0);

  useEffect(() => {
    // Obtener los datos del backend
    const fetchData = async () => {
      try {
        // Obtener cantidad de productos
        const productosResponse = await axios.get('http://localhost:3001/api/productos/count');
        setProductosCount(productosResponse.data.count);

        // Obtener cantidad de clientes
        const clientesResponse = await axios.get('http://localhost:3001/api/clientes/count');
        setClientesCount(clientesResponse.data.count);

        // Obtener cantidad de empleados
        const empleadosResponse = await axios.get('http://localhost:3001/api/empleado/count');
        setEmpleadosCount(empleadosResponse.data.count);
      } catch (error) {
        console.error('Error al obtener los datos', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Bienvenido, {user?.username} 👋</h2>
      
      <div className="row mt-4">
        {/* Tarjetas resumen */}
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Productos</h5>
              <p className="card-text">Total: {productosCount}</p>
              <button onClick={() => navigate('/dashboard/inventario')} className="btn btn-primary btn-sm">
                Ver productos
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Clientes</h5>
              <p className="card-text">Registrados: {clientesCount}</p>
              <button onClick={() => navigate('/dashboard/clientes')} className="btn btn-primary btn-sm">
                Ver clientes
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Empleados</h5>
              <p className="card-text">Activos: {empleadosCount}</p>
              <button onClick={() => navigate('/dashboard/recursos-humanos')} className="btn btn-primary btn-sm">
                Ver empleados
              </button>
            </div>
          </div>
        </div>

        {user?.role_id <= 2 && (
          <div className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Configuración</h5>
                <p className="card-text">Gestión de usuarios</p>
                <button onClick={() => navigate('/dashboard/registro-usuario')} className="btn btn-danger btn-sm">
                  Ir a configuración
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
