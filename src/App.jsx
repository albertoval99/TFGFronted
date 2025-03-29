import { useEffect, useState } from 'react';
import './App.css';
import { Outlet, useLocation } from 'react-router';
import Aurora from './components/Aurora/Aurora';
import NavBarSinUser from './components/NavBar/navBarSinUser';
import { userService } from './services/usuarios.service';

function App() {
  const [usuario, setUsuario] = useState(null);
  
  const location = useLocation();  // Detecta cambios en la ruta actual

  useEffect(() => {
    const user = userService.getUser();
    if (user) {
      setUsuario(user.user);  // Establece el usuario en el estado global
    }
  }, [location]);  // Cuando cambie la ruta, vuelve a verificar el usuario

  return (
    <div className="app-container" style={{ backgroundColor: 'black' }}>
      <div className="aurora-background">
        <Aurora
          colorStops={["#00D8FF", "#CE32FD", "#00D8FF"]}
          blend={0.5}
          amplitude={0.5}
          speed={1}
        />
      </div>
      <NavBarSinUser />
      <div className="content-container">
        <Outlet context={{ usuario, setUsuario }}></Outlet>
      </div>
    </div>
  );
}

export default App;
