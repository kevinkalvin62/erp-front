import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // Ruta de la API de tu backend

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: ''
  });
  const [error, setError] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasError, setHasError] = useState(false);

  // Efecto para obtener los clientes de la base de datos
  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const response = await axios.get(`${API_URL}/clientes`);
        setClientes(response.data);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
        setError('Hubo un problema al cargar los clientes');
        setHasError(true);
      }
    };

    obtenerClientes();
  }, []);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAgregarCliente = async e => {
    e.preventDefault();

    const { nombre, correo, telefono, direccion } = formData;

    if (!nombre || !correo || !telefono || !direccion) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      if (editandoId) {
        // Lógica para editar cliente (actualiza cliente con editandoId)
        const response = await axios.put(`${API_URL}/clientes/${editandoId}`, { nombre, correo, telefono, direccion });
        setClientes(clientes.map(cliente => (cliente.id === editandoId ? response.data : cliente)));
      } else {
        // Lógica para agregar nuevo cliente
        const response = await axios.post(`${API_URL}/clientes`, { nombre, correo, telefono, direccion });
        setClientes([...clientes, response.data]);
      }

      setFormData({ nombre: '', correo: '', telefono: '', direccion: '' });
      setError('');
      setEditandoId(null);
    } catch (error) {
      setError('Error al agregar/actualizar el cliente');
      console.error(error);
    }
  };

  const handleEliminarCliente = async id => {
    const confirmDelete = window.confirm('¿Eliminar este cliente?');
    if (confirmDelete) {
      try {
        await axios.delete(`${API_URL}/clientes/${id}`);
        setClientes(clientes.filter(cliente => cliente.id !== id));
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      }
    }
  };

  const handleEditarCliente = cliente => {
    setFormData({
      nombre: cliente.nombre,
      correo: cliente.correo,
      telefono: cliente.telefono,
      direccion: cliente.direccion
    });
    setEditandoId(cliente.id);
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setFormData({ nombre: '', correo: '', telefono: '', direccion: '' });
    setError('');
  };

  // Filtrar clientes por nombre
  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="mb-4">Gestión de Clientes</h2>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar cliente por nombre"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <form className="mb-4" onSubmit={handleAgregarCliente}>
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="form-control"
              placeholder="Nombre del cliente"
            />
          </div>
          <div className="col-md-3">
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="form-control"
              placeholder="Correo electrónico"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="form-control"
              placeholder="Teléfono"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="form-control"
              placeholder="Dirección"
            />
          </div>
          <div className="col-md-3 d-grid">
            <button type="submit" className="btn btn-success">
              {editandoId ? 'Guardar cambios' : 'Agregar'}
            </button>
          </div>
        </div>
        {editandoId && (
          <div className="mt-2">
            <button onClick={handleCancelarEdicion} className="btn btn-secondary btn-sm">
              Cancelar edición
            </button>
          </div>
        )}
        {error && <div className="mt-2 text-danger">{error}</div>}
      </form>

      {clientes.length === 0 ? (
        <p>No hay clientes disponibles</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.correo}</td>
                <td>{cliente.telefono}</td>
                <td className="d-flex gap-2">
                  <button
                    onClick={() => handleEditarCliente(cliente)}
                    className="btn btn-warning btn-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminarCliente(cliente.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Clientes;
