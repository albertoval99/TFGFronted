import { Link, useNavigate } from "react-router";
import "./SideBar.css";
import { userService } from "../../services/usuarios.service";
import homeIcon from "/src/assets/home.svg";
import loginIcon from "/src/assets/loginIcon.svg";
import logOut from "/src/assets/logout.svg";
import addUser from "/src/assets/addUser.svg";
import ligaIcon from "/src/assets/ligaIcon.svg";
import teamIcon from "/src/assets/teamIcon.svg";
import update from "/src/assets/update.svg";
import event from "/src/assets/event.svg";
import crearEntrenamiento from "/src/assets/crearEntrenamiento.svg";
import verEntreno from "/src/assets/verEntreno.svg";
import partidosIcon from "/src/assets/ligaIcon.svg";

export default function SideBar({ isOpen, toggleSidebar, setUsuario, tipo }) {
  const navigate = useNavigate();
  const sidebarMenus = {
    invitado: [
      { to: "/", icon: homeIcon, label: "Inicio" },
      { to: "/login", icon: loginIcon, label: "Entrar" },
    ],
    admin: [
      { to: "/admin", icon: homeIcon, label: "Inicio" },
      { to: "/registroLiga", icon: ligaIcon, label: "Registrar Liga" },
      { to: "/registroEquipo", icon: teamIcon, label: "Registrar Equipo" },
      { to: "/registroArbitro", icon: addUser, label: "Registrar Árbitro" },
      { to: "/registroEntrenador", icon: addUser, label: "Registrar Entrenador" },
      { to: "/logout", icon: logOut, label: "Cerrar Sesión", isLogout: true },
    ],
    arbitro: [
      { to: "/arbitro", icon: homeIcon, label: "Inicio" },
      { to: "/verPartidosAsignados", icon: event, label: "Ver Partidos Asignados" },
      { to: "/actualizarPerfil", icon: update, label: "Actualizar Perfil" },
      { to: "/logout", icon: logOut, label: "Cerrar Sesión", isLogout: true },
    ],
    entrenador: [
      { to: "/entrenador", icon: homeIcon, label: "Inicio" },
      { to: "/crearEntrenamiento", icon: crearEntrenamiento, label: "Programar Entrenamiento" },
      { to: "/verEntrenamientos", icon: verEntreno, label: "Ver Entrenamientos" },
      { to: "/gestionarPlantilla", icon: teamIcon, label: "Gestionar Plantilla" },
      { to: "/gestionarPartidos", icon: partidosIcon, label: "Gestionar Partidos" },
      { to: "/actualizarPerfil", icon: update, label: "Actualizar Perfil" },
      { to: "/logout", icon: logOut, label: "Cerrar Sesión", isLogout: true },
    ],
    jugador: [
      { to: "/jugador", icon: homeIcon, label: "Inicio" },
      { to: "/verEntrenamientosJugador", icon: verEntreno, label: "Ver Entrenamientos" },
      { to: "/actualizarPerfil", icon: update, label: "Actualizar Perfil" },
      { to: "/logout", icon: logOut, label: "Cerrar Sesión", isLogout: true },
    ],
  };

  const handleLogout = () => {
    userService.logout();
    if (setUsuario) setUsuario(null);
    navigate("/");
  };

  const menu = sidebarMenus[tipo] || sidebarMenus["invitado"];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="close-sidebar" onClick={toggleSidebar}>×</button>
      </div>
      <div className="sidebar-menu">
        {menu.map((item, idx) =>
          item.isLogout ? (
            <button key={idx} onClick={handleLogout} className="sidebar-item-btn">
              <div className="sidebar-item" onClick={toggleSidebar}>
                <div className="sidebar-icon">
                  <img src={item.icon} alt={item.label} className="w-6 h-6" />
                </div>
                <span>{item.label}</span>
              </div>
            </button>
          ) : (
            <Link key={idx} to={item.to} className="sidebar-item" onClick={toggleSidebar}>
              <div className="sidebar-icon">
                <img src={item.icon} alt={item.label} className="w-6 h-6" />
              </div>
              <span>{item.label}</span>
            </Link>
          )
        )}
      </div>
    </div>
  );
}