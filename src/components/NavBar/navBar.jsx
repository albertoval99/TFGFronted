import { Link } from "react-router";
import { useState } from "react";
import SideBar from "../Sidebar/Sidebar";  
import SideBarAdmin from "../Sidebar/SidebarAdmin"; 
import menuIcon from "/src/assets/menuIcon.svg";
import SideBarEntrenador from "../Sidebar/SideBarEntrenador";
import SideBarArbitro from "../Sidebar/SideBarArbitro";
import SideBarJugador from "../Sidebar/SideBarJugador";
import logo from "/src/assets/logo.png"

export default function NavBar({ usuario, setUsuario }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

   // Función para renderizar el sidebar según el rol
   const renderSidebar = () => {
    if (!usuario) {
      return <SideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />;
    }
    switch (usuario.rol) {
      case "administrador":
        return (
          <SideBarAdmin
            isOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            usuario={usuario}
            setUsuario={setUsuario}
          />
        );
      case "entrenador":
        return (
          <SideBarEntrenador
            isOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            usuario={usuario}
            setUsuario={setUsuario}
          />
        );
      case "arbitro":
        return (
          <SideBarArbitro
            isOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            usuario={usuario}
            setUsuario={setUsuario}
          />
        );
      case "jugador":
        return (
          <SideBarJugador
            isOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            usuario={usuario}
            setUsuario={setUsuario}
          />
        );
      default:
        return <SideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />;
    }
  };

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

      {sidebarOpen && renderSidebar()}

      {sidebarOpen && <div className="sidebar-overlay active" onClick={toggleSidebar}></div>}
    </>
  );
}
