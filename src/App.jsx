import { useEffect, useState } from 'react';
import './App.css';
import { Outlet } from 'react-router';
import Aurora from './components/Aurora/Aurora';
import { userService } from './services/usuarios.service';
import NavBar from './components/NavBar/navBar';

function App() {
  const [usuario, setUsuario] = useState(null);
  
  useEffect(() => {
    const decodedToken = userService.getUser(); 
    if (decodedToken) {
      setUsuario(decodedToken.user); 
    }
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
        <Outlet context={{ usuario, setUsuario }}></Outlet>
      </div>
    </div>
  );
}

export default App;
