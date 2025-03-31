import { Link } from "react-router";
import { useState, useEffect } from "react";
import { userService } from "/src/services/usuarios.service";  // Asegúrate de importar tu servicio
import SideBar from "../Sidebar/Sidebar";  // Asegúrate de que tienes el componente SideBar
import SideBarAdmin from "../Sidebar/SidebarAdmin"; // Si tienes un SideBarAdmin
import menuIcon from "/src/assets/menuIcon.svg";

export default function NavBarSinUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);

  // Obtener el usuario desde el token al montar el componente
  useEffect(() => {
    const user = userService.getUser();  // Obtén el usuario decodificado del token
    if (user) {
      setUsuario(user.user);  // Guarda el usuario en el estado
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <nav className="bg-transparent p-4 fixed w-full top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-2xl font-bold">
            <Link to="/"><img src="/src/assets/logo.png" alt="Logo" className="logo-image"></img></Link>
          </div>

          <button className="menu-button bg-white rounded-lg p-2" onClick={toggleSidebar}>
            <img
              src={menuIcon}
              alt="Menu"
              className="w-10 h-10"
            />
          </button>
        </div>
      </nav>

      {/* Aquí decidimos qué sidebar mostrar en función del rol */}
      {sidebarOpen && (
        usuario && usuario.rol === "administrador" ? 
          <SideBarAdmin isOpen={sidebarOpen} toggleSidebar={toggleSidebar} /> : 
          <SideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      )}

      {sidebarOpen && <div className="sidebar-overlay active" onClick={toggleSidebar}></div>}
    </>
  );
}
