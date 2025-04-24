import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [formData, setFormData] = useState({
    cliente: '',
    producto: '',
    cantidad: '',
    total: '',
  });
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Cargar ventas desde el backend
    axios.get('http://localhost:3001/api/ventas')  // Asegúrate de que esta URL es la correcta para tu API
      .then((response) => {
        console.log('Ventas desde el backend:', response.data);  // Verifica la estructura de datos
        setVentas(response.data);
      })
      .catch((error) => console.error('Error al cargar las ventas:', error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistrarVenta = (e) => {
    e.preventDefault();
    const { cliente, producto, cantidad, total } = formData;
  
    if (!cliente || !producto || !cantidad || !total) return;
  
    // Crear un objeto de venta y productos
    const nuevaVenta = {
      cliente,
      total: parseFloat(total),
      fecha: new Date().toISOString().split('T')[0],
      productos: [{
        producto_id: producto, // Necesitas ajustar esto para el ID correcto
        cantidad: parseInt(cantidad),
        precio_unitario: parseFloat(total) / cantidad, // O algún otro cálculo basado en tu lógica
      }]
    };
  
    axios.post('http://localhost:3001/api/ventas', nuevaVenta)
      .then((response) => {
        console.log('Venta registrada exitosamente:', response.data);
        setVentas([response.data, ...ventas]);  // Asegúrate de agregar la nueva venta correctamente
      })
      .catch((error) => console.error('Error al registrar la venta:', error));
  };
  

  // Filtrar ventas con validación para evitar undefined
  const ventasFiltradas = ventas.filter(
    (v) =>
      (v.cliente && v.cliente.toLowerCase().includes(search.toLowerCase())) ||
      (v.producto && v.producto.toLowerCase().includes(search.toLowerCase()))
  );

  const productoMasVendido = (ventas) => {
    const conteo = {};
    ventas.forEach((v) => {
      conteo[v.producto] = (conteo[v.producto] || 0) + v.cantidad;
    });

    const top = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0];
    return top ? `${top[0]} (${top[1]} unidades)` : 'N/A';
  };

  const generarPDF = () => {
    const doc = new jsPDF();  // Crear una nueva instancia de jsPDF

    // Agregar título al PDF
    doc.setFontSize(18);
    doc.text('Reporte de Ventas', 14, 22);  // El título en la posición (14, 22) en la página

    // Definir los encabezados de la tabla
    const headers = [['Fecha', 'Cliente', 'Producto', 'Cantidad', 'Total ($)']];

    // Definir los datos de las ventas (filtradas)
    const datos = ventasFiltradas.map((v) => [
      v.fecha,
      v.cliente,
      v.producto,
      v.cantidad,
      `$${v.total.toFixed(2)}`,
    ]);

    // Agregar la tabla al documento PDF
    doc.autoTable({
      head: headers,  // Encabezado de la tabla
      body: datos,    // Cuerpo de la tabla con las ventas
      startY: 30,     // Comienza la tabla en Y=30 (debajo del título)
      styles: { fontSize: 10 },  // Estilo para la tabla (puedes modificar esto)
    });

    // Descargar el archivo PDF con el nombre 'reporte_ventas.pdf'
    doc.save('reporte_ventas.pdf');
  };

  return (
    <div>
      <h2 className="mb-4">Ventas</h2>

      {/* Dashboard / Resumen */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total de Ventas</h5>
              <p className="card-text fs-4">{ventas.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Monto Total Vendido</h5>
              <p className="card-text fs-4">
                ${ventas.reduce((sum, v) => sum + v.total, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-dark">
            <div className="card-body">
              <h5 className="card-title">Producto Más Vendido</h5>
              <p className="card-text fs-5">{productoMasVendido(ventas)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buscador y botón PDF */}
      <div className="row mb-4 g-2 align-items-center">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por cliente o producto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6 text-end">
          <button className="btn btn-outline-danger" onClick={generarPDF}>
            Exportar a PDF
          </button>
        </div>
      </div>

      {/* Tabla de ventas */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Total ($)</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.length > 0 ? (
              ventasFiltradas.map((venta) => (
                <tr key={venta.venta_id}>
                  <td>{venta.fecha}</td>
                  <td>{venta.cliente}</td>
                  <td>{venta.producto}</td>
                  <td>{venta.cantidad}</td>
                  <td>{venta.total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay ventas que coincidan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ventas;
