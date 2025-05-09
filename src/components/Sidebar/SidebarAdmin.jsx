import { Link, useNavigate } from "react-router";
import "./SideBar.css";
import homeIcon from "/src/assets/home.svg";
import logOut from "/src/assets/logout.svg";
import addUser from "/src/assets/addUser.svg";
import ligaIcon from "/src/assets/ligaIcon.svg";
import teamIcon from "/src/assets/teamIcon.svg";
import { userService } from "../../services/usuarios.service";

export default function SideBarAdmin({ isOpen, toggleSidebar, setUsuario }) {

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
        <Link to="/admin" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={homeIcon} alt="Inicio" className="w-6 h-6" />
          </div>
          <span>Inicio</span>
        </Link>
        <Link to="/registroArbitro" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={addUser} alt="Registrar Árbitro" className="w-6 h-6" />
          </div>
          <span>Registrar Árbitro</span>
        </Link>
        <Link to="/registroEntrenador" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={addUser} alt="Registrar Entrenador" className="w-6 h-6" />
          </div>
          <span>Registrar Entrenador</span>
        </Link>
        <Link to="/registroLiga" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={ligaIcon} alt="Registrar Liga" className="w-6 h-6" />
          </div>
          <span>Registrar Liga</span>
        </Link>
        <Link to="/registroEquipo" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={teamIcon} alt="Registrar Equipo" className="w-6 h-6" />
          </div>
          <span>Registrar Equipo</span>
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