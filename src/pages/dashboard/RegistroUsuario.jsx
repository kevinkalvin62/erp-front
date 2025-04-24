import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegistroUsuario = ({ currentUser }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    username: '',
    password: '',
    role_id: '',
  });

  const [roles, setRoles] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Obtener roles disponibles desde el backend
    axios.get('http://localhost:3001/api/roles')
      .then(res => setRoles(res.data))
      .catch(err => console.error('Error cargando roles:', err));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/api/registrar-usuario', formData);
      setMensaje('Usuario registrado correctamente ✅');
      setFormData({
        nombre: '',
        correo: '',
        username: '',
        password: '',
        role_id: '',
      });
    } catch (err) {
      setMensaje('❌ Error al registrar el usuario');
      console.error(err);
    }
  };

  // Solo permitir si es superadmin
  if (currentUser?.role !== 'superadmin') {
    return <p>Acceso denegado 🚫</p>;
  }

  return (
    <div className="container mt-4">
      <h3>Registrar Nuevo Usuario</h3>
      {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
      <form onSubmit={handleSubmit} className="row g-3 mt-2">
        <div className="col-md-6">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del empleado"
            className="form-control"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            className="form-control"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <select
            name="role_id"
            className="form-select"
            value={formData.role_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un rol</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-success">Registrar Usuario</button>
        </div>
      </form>
    </div>
  );
};

export default RegistroUsuario;
