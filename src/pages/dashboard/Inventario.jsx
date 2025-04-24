import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: ''
  });
  const [error, setError] = useState('');
  const [editandoId, setEditandoId] = useState(null); // ID del producto que estamos editando
  const [searchTerm, setSearchTerm] = useState(''); // Termino de búsqueda

  // Obtener productos del backend
  useEffect(() => {
    axios.get('http://localhost:3001/api/productos')
      .then((response) => setProductos(response.data))
      .catch((err) => console.error('Error al obtener productos:', err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAgregarProducto = (e) => {
    e.preventDefault();

    const { nombre, descripcion, precio, stock } = formData;

    if (!nombre || !descripcion || !precio || !stock) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const producto = {
      nombre,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock)
    };

    if (editandoId) {
      // Editar producto existente
      axios.put(`http://localhost:3001/api/productos/${editandoId}`, producto)
        .then((response) => {
          setProductos(productos.map((producto) => 
            producto.id === editandoId ? { ...producto, ...formData } : producto
          ));
          setEditandoId(null);
        })
        .catch((err) => setError('Error al actualizar el producto'));
    } else {
      // Agregar nuevo producto
      axios.post('http://localhost:3001/api/productos', producto)
        .then((response) => {
          setProductos([...productos, { ...producto, id: Date.now() }]);
        })
        .catch((err) => setError('Error al agregar el producto'));
    }

    setFormData({ nombre: '', descripcion: '', precio: '', stock: '' });
    setError('');
  };

  const handleEliminarProducto = (id) => {
    const confirmDelete = window.confirm('¿Eliminar este producto?');
    if (confirmDelete) {
      axios.delete(`http://localhost:3001/api/productos/${id}`)
        .then(() => {
          setProductos(productos.filter((producto) => producto.id !== id));
        })
        .catch((err) => setError('Error al eliminar el producto'));
    }
  };

  const handleEditarProducto = (producto) => {
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock
    });
    setEditandoId(producto.id);
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setFormData({ nombre: '', descripcion: '', precio: '', stock: '' });
    setError('');
  };

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="mb-4">Inventario de Productos</h2>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar producto por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <form className="mb-4" onSubmit={handleAgregarProducto}>
        <div className="row g-3">
          <div className="col-md-3">
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="form-control"
              placeholder="Nombre del producto"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="form-control"
              placeholder="Descripción"
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className="form-control"
              placeholder="Precio"
              step="0.01"
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="form-control"
              placeholder="Stock"
            />
          </div>
          <div className="col-md-2 d-grid">
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

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td>${producto.precio.toFixed(2)}</td>
              <td>{producto.stock}</td>
              <td className="d-flex gap-2">
                <button
                  onClick={() => handleEditarProducto(producto)}
                  className="btn btn-warning btn-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminarProducto(producto.id)}
                  className="btn btn-danger btn-sm"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventario;
