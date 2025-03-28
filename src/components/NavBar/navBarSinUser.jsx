// src/components/NavBar/NavBar.jsx

import { Link } from "react-router";


export default function NavBarSinUser() {
  return (
    <nav className="bg-transparent p-4 fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <Link to="/">Logo</Link>
        </div>
        
        <div className="flex space-x-6">
          <Link to="/" className="text-white hover:text-purple-400 transition-colors">
            Inicio
          </Link>
          <Link to="/servicios" className="text-white hover:text-purple-400 transition-colors">
            Servicios
          </Link>
          <Link to="/contacto" className="text-white hover:text-purple-400 transition-colors">
            Contacto
          </Link>
          <Link to="/login" className="text-white hover:text-purple-400 transition-colors">
            Login
          </Link>
        </div>
      </div>
    </nav>
  )
}

