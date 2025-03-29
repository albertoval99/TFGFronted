import { useEffect, useState } from 'react';
import './App.css';
import { Outlet } from 'react-router';
import Aurora from './components/Aurora/Aurora';
import NavBarSinUser from './components/NavBar/navBarSinUser';
import { userService } from './services/usuarios.service';

function App() {
  const [usuario, setUsuario] = useState(null);
  
  useEffect(() => {
    async function fetchUsuarios() {
      const response = await userService.getUsuarios();
      if (response.status === 200) {
        console.log(response.usuarios); 
      } else {
        console.error(response.message); 
      }
    }
    fetchUsuarios();
  }, []);

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
