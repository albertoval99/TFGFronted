
import { Link } from "react-router"; // Corregido
import "./SideBar.css";

export default function SideBar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="close-sidebar" onClick={toggleSidebar}>×</button>
      </div>
      
      <div className="sidebar-menu">
        <Link to="/" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">🏋️</div>
          <span>Entrenadores</span>
        </Link>
        
        <Link to="/servicios" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">🥇</div>
          <span>Árbitros</span>
        </Link>
        
        <Link to="/contacto" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">⚽</div>
          <span>Jugadores</span>
        </Link>
        
        <Link to="/login" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">👑</div>
          <span>Administrador</span>
        </Link>
      </div>
    </div>
  );
}