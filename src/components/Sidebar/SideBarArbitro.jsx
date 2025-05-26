import { Link, useNavigate } from "react-router";
import "./SideBar.css";
import homeIcon from "/src/assets/home.svg";
import logOut from "/src/assets/logout.svg";
import { userService } from "../../services/usuarios.service";
import update from "/src/assets/update.svg"
import event from "/src/assets/event.svg"

export default function SideBarArbitro({ isOpen, toggleSidebar, setUsuario }) {

  const navigate = useNavigate();
  const handleLogout = () => {
    userService.logout();
    setUsuario(null);
    navigate("/");
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="close-sidebar" onClick={toggleSidebar}>×</button>
      </div>
      <div className="sidebar-menu">
        <Link to="/arbitro" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={homeIcon} alt="Login" className="w-6 h-6" />
          </div>
          <span>Inicio</span>
        </Link>
        <Link to="/verPartidosAsignados" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={event} alt="Ver Partidos Asignados" className="w-6 h-6" />
          </div>
          <span>Ver Partidos Asignados</span>
        </Link>
        <Link to="/actualizarPerfil" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={update} alt="Actualizar Perfil" className="w-6 h-6" />
          </div>
          <span>Actualizar Perfil</span>
        </Link>
        <button onClick={handleLogout}>
          <Link className="sidebar-item" onClick={toggleSidebar}>
            <div className="sidebar-icon">
              <img src={logOut} alt="Logout" className="w-6 h-6" />
            </div>
            <span>Cerrar Sesión</span>
          </Link></button>
      </div>
    </div>
  );
}