import { NavLink } from 'react-router-dom';

const Sidebar = ({ user }) => {
  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: '250px' }}>
      <h4 className="mb-4">ERP</h4>
      <ul className="nav flex-column gap-2">
        <li className="nav-item">
          <NavLink to="/dashboard" className="nav-link text-white">Dashboard</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/dashboard/inventario" className="nav-link text-white">Inventario</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/dashboard/clientes" className="nav-link text-white">Clientes</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/dashboard/ventas" className="nav-link text-white">Ventas</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/dashboard/recursos-humanos" className="nav-link text-white">Recursos Humanos</NavLink>
        </li>
          <li className="nav-item">
            <NavLink to="/dashboard/RegistroUsuario" className="nav-link text-warning">Registro de Usuario</NavLink>
          </li>
        
      </ul>
    </div>
  );
};

export default Sidebar;
