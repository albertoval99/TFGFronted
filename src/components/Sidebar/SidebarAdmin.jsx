import { Link, useNavigate } from "react-router";
import "./SideBar.css";
import loginIcon from "/src/assets/loginIcon.svg";
import homeIcon from "/src/assets/home.svg";
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
        <Link to="/" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={homeIcon} alt="Login" className="w-6 h-6" />
          </div>
          <span>Ir al inicio</span>
        </Link>
        <Link to="/login" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={loginIcon} alt="Login" className="w-6 h-6" />
          </div>
          <span>Ir al inicio de sesion</span>
        </Link>
        <Link to="/login" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={loginIcon} alt="Login" className="w-6 h-6" />
          </div>
          <span>SOY ADMIN</span>
        </Link>
        <Link to="/registrarArbitro" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={loginIcon} alt="Login" className="w-6 h-6" />
          </div>
          <span>Registrar Arbitro</span>
        </Link>
        <Link to="/registrarEntrenador" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={loginIcon} alt="Login" className="w-6 h-6" />
          </div>
          <span>Registrar Entrenador</span>
        </Link>
        <button onClick={handleLogout}>
          <Link className="sidebar-item" onClick={toggleSidebar}>
            <div className="sidebar-icon">
              <img src={loginIcon} alt="Logout" className="w-6 h-6" />
            </div>
            <span>LogOut</span>
          </Link></button>

      </div>
    </div>
  );
}