import { Link, useNavigate } from "react-router";
import "./SideBar.css";
import homeIcon from "/src/assets/home.svg";
import logOut from "/src/assets/logout.svg";
import addUser from "/src/assets/addUser.svg";
import crearEntrenamiento from "/src/assets/crearEntrenamiento.svg"
import verEntreno from "/src/assets/verEntreno.svg"
import { userService } from "../../services/usuarios.service";

export default function SideBarEntrenador({ isOpen, toggleSidebar, setUsuario }) {

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
        <Link to="/entrenador" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={homeIcon} alt="Login" className="w-6 h-6" />
          </div>
          <span>Inicio</span>
        </Link>
        <Link to="/crearEntrenamiento" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={crearEntrenamiento} alt="Programar Entrenamient" className="w-6 h-6" />
          </div>
          <span>Programar Entrenamiento</span>
        </Link>
        <Link to="/verEntrenamientos" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={verEntreno} alt="Ver Entrenamientos" className="w-6 h-6" />
          </div>
          <span>Ver Entrenamientos</span>
        </Link>
        <Link to="/registroJugador" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={addUser} alt="Login" className="w-6 h-6" />
          </div>
          <span>Registrar Jugador</span>
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