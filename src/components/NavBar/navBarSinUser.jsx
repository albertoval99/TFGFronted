import { Link } from "react-router";
import { useState } from "react";
import SideBar from "../Sidebar/Sidebar";
import menuIcon from "/src/assets/menuIcon.svg";

export default function NavBarSinUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      <SideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && <div className="sidebar-overlay active" onClick={toggleSidebar}></div>}
    </>
  );
}