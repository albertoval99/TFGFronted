
import { Link } from "react-router";


export default function NavBarSinUser() {
  return (
    <nav className="bg-transparent p-4 fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <Link to="/"><img src="/src/assets/logo.png" alt="Logo" className="logo-image"></img></Link>
        </div>
        
        <div className="flex space-x-6">
          <Link to="/" className="text-white hover:text-purple-400 transition-colors">
            <button className="button">Home</button>
          </Link>
          <Link to="/servicios" className="text-white hover:text-purple-400 transition-colors">
            <button className="button">Servicios</button>
          </Link>
          <Link to="/contacto" className="text-white hover:text-purple-400 transition-colors">
            <button className="button">Contacto</button>
          </Link>
          <Link to="/login" className="text-white hover:text-purple-400 transition-colors">
            <button className="button">Login</button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

