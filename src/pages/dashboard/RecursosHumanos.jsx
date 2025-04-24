import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api/empleados';

const RecursosHumanos = () => {
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    puesto: '',
    correo: '',
    telefono: '',
    salario: '',
    fecha_contratacion: '',
  });
  const [editandoId, setEditandoId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar empleados al iniciar
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setEmpleados(data))
      .catch(err => console.error('Error al cargar empleados:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAgregarEmpleado = async (e) => {
    e.preventDefault();
    const { nombre, puesto, correo, telefono, salario, fecha_contratacion } = formData;
    if (!nombre || !puesto || !correo) return;

    try {
      if (editandoId) {
        await fetch(`${API_URL}/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        setEditandoId(null);
      } else {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const nuevo = await res.json();
        formData.id = nuevo.id;
      }

      // Recargar empleados
      const res = await fetch(API_URL);
      const data = await res.json();
      setEmpleados(data);
      setFormData({
        nombre: '',
        puesto: '',
        correo: '',
        telefono: '',
        salario: '',
        fecha_contratacion: '',
      });
    } catch (error) {
      console.error('Error al guardar empleado:', error);
    }
  };

  const handleEditar = (empleado) => {
    setFormData({ ...empleado });
    setEditandoId(empleado.id);
  };

  const handleEliminar = async (id) => {
    const confirm = window.confirm('¿Eliminar empleado?');
    if (!confirm) return;

    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setEmpleados(empleados.filter((e) => e.id !== id));
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
    }
  };

  const empleadosFiltrados = empleados.filter((emp) =>
    emp.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="mb-4">Recursos Humanos</h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar empleado por nombre"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <form className="mb-4" onSubmit={handleAgregarEmpleado}>
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="form-control"
              placeholder="Nombre completo"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="puesto"
              value={formData.puesto}
              onChange={handleChange}
              className="form-control"
              placeholder="Puesto"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="form-control"
              placeholder="Correo"
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
              type="number"
              name="salario"
              value={formData.salario}
              onChange={handleChange}
              className="form-control"
              placeholder="Salario"
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              name="fecha_contratacion"
              value={formData.fecha_contratacion}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="mt-3">
          <button type="submit" className="btn btn-primary">
            {editandoId ? 'Guardar cambios' : 'Agregar empleado'}
          </button>
        </div>
      </form>

      <div className="row">
        {empleadosFiltrados.map((empleado) => (
          <div className="col-md-4 mb-4" key={empleado.id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">{empleado.nombre}</h5>
                <p className="card-text">
                  <strong>Puesto:</strong> {empleado.puesto} <br />
                  <strong>Correo:</strong> {empleado.correo} <br />
                  <strong>Teléfono:</strong> {empleado.telefono} <br />
                  <strong>Salario:</strong> ${empleado.salario} <br />
                  <strong>Fecha de contratación:</strong> {empleado.fecha_contratacion}
                </p>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEditar(empleado)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleEliminar(empleado.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecursosHumanos;
