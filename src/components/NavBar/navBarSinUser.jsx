
import { Link } from "react-router"; 
import { useState } from "react";
import SideBar from "../Sidebar/Sidebar";

export default function NavBarSinUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    console.log("Sidebar toggled:", !sidebarOpen);
  };

  return (
    <>
      <nav className="bg-transparent p-4 fixed w-full top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-2xl font-bold">
            <Link to="/"><img src="/src/assets/logo.png" alt="Logo" className="logo-image"></img></Link>
          </div>
          
          
          <button className="menu-button" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>
      
      <SideBar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      {sidebarOpen && <div className="sidebar-overlay active" onClick={toggleSidebar}></div>}
    </>
  );
}