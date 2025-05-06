
import { Link } from "react-router";
import "./SideBar.css";
import loginIcon from "/src/assets/loginIcon.svg";
import homeIcon from "/src/assets/home.svg";

export default function SideBar({ isOpen, toggleSidebar }) {
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
          <span>Inicio</span>
        </Link>
        <Link to="/login" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={loginIcon} alt="Login" className="w-6 h-6" />
          </div>
          <span>Entrar</span>
        </Link>
        <Link to="/calendario2Reg2-1" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
            <img src={loginIcon} alt="calendario" className="w-6 h-6" />
          </div>
          <span>Calendario 2ºReg 2-1</span>
        </Link>

      </div>
    </div>
  );
}