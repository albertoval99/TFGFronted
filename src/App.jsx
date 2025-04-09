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
      // Decodifica el token para obtener la información mínima (email, id, rol)
      const decodedToken = userService.getUser();
      
      if (decodedToken) {
        try {
          // Llama al endpoint que devuelve el perfil completo
          const response = await userService.getUserByEmail(decodedToken.email);
          console.log("Respuesta de la API:", response);
          if (response.status === 200) {
            // Se actualiza el usuario con el objeto completo
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
    <div className="app-container" style={{ backgroundColor: 'black' }}>
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
        {/* El contexto se pasa a todas las rutas anidadas */}
        <Outlet context={{ usuario, setUsuario }}></Outlet>
      </div>
    </div>
  );
}

export default App;
