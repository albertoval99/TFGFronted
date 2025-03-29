
import { Link } from "react-router"; 
import "./SideBar.css";
import loginIcon from "/src/assets/loginIcon.svg";

export default function SideBar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button className="close-sidebar" onClick={toggleSidebar}>×</button>
      </div>
      
      <div className="sidebar-menu">
        <Link to="/login" className="sidebar-item" onClick={toggleSidebar}>
          <div className="sidebar-icon">
          <img src={loginIcon} alt="Login" className="w-6 h-6" />
          </div>
          <span>Ir al inicio de sesion</span>
        </Link>
      </div>
    </div>
  );
}