import { Link } from "react-router";
import { useState } from "react";
import menuIcon from "/src/assets/menuIcon.svg";
import logo from "/src/assets/logo.png";
import SideBar from "../Sidebar/Sidebar";

export default function NavBar({ usuario, setUsuario }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Determina el tipo de usuario para el SideBar
  const getTipoUsuario = () => {
    if (!usuario) return "invitado";
    switch (usuario.rol) {
      case "administrador":
        return "admin";
      case "entrenador":
        return "entrenador";
      case "arbitro":
        return "arbitro";
      case "jugador":
        return "jugador";
      default:
        return "invitado";
    }
  };

  const tipoUsuario = getTipoUsuario();

  return (
    <>
      <nav className="bg-transparent p-4 w-full top-0 z-10">
        <div className="flex justify-between items-center w-full px-4 md:px-8">
          <div className="text-white text-2xl font-bold">
            <Link to="/">
              <img src={logo} alt="Logo" className="logo-image" />
            </Link>
          </div>

          <button className="menu-button bg-white rounded-lg p-2" onClick={toggleSidebar}>
            <img src={menuIcon} alt="Menu" className="w-10 h-10" />
          </button>
        </div>
      </nav>

      {sidebarOpen && (
        <SideBar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          setUsuario={setUsuario}
          tipo={tipoUsuario} // Pasa el tipo de usuario al SideBar
        />
      )}

      {sidebarOpen && <div className="sidebar-overlay active" onClick={toggleSidebar}></div>}
    </>
  );
}