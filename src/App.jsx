import { useEffect, useState } from 'react';
import './App.css';
import { Outlet } from 'react-router';
import Aurora from './components/Aurora/Aurora';
import { userService } from './services/usuarios.service';
import NavBar from './components/NavBar/navBar';

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function fetchUsuarioCompleto() {
      const decodedToken = userService.getUser();
      if (decodedToken) {
        try {
          const response = await userService.getUserByEmail(decodedToken.email);
          if (response.status === 200) {
            setUsuario(response.usuario);
          } else {
            console.error("Error al obtener el perfil completo:", response.message);
          }
        } catch (error) {
          console.error("Error en la llamada a la API", error);
        }
      }
    }
    fetchUsuarioCompleto();
  }, []);

  return (
    <div className="app-container">
      <div className="aurora-background">
        <Aurora
          colorStops={["#00D8FF", "#CE32FD", "#00D8FF"]}
          blend={0.5}
          amplitude={0.5}
          speed={1}
        />
      </div>
      <NavBar usuario={usuario} setUsuario={setUsuario} />
      <div className="content-container">
        <Outlet context={{ usuario, setUsuario }}></Outlet>
      </div>
    </div>
  );
}

export default App;
