import { Link, useNavigate } from "react-router";
import "./SideBar.css";
import homeIcon from "/src/assets/home.svg";
import logOut from "/src/assets/logout.svg";
import { userService } from "../../services/usuarios.service";

export default function SideBarJugador({ isOpen, toggleSidebar, setUsuario }) {

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
        <Link to="/jugador" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={homeIcon} alt="Login" className="w-6 h-6" />
          </div>
          <span>Inicio</span>
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