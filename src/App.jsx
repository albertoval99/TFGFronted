import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router'
import Aurora from './components/Aurora/Aurora'
import NavBarSinUser from './components/NavBar/navBarSinUser'


//import NavBarController from './components/NavBar/NavBarController'

function App() {
  const [usuario, setUsuario] = useState(null)

  /** 
  useEffect(()=>{
    get("/usuarios", setUsuario, "Error imprimiendo Usuarios")
  },[])*/

  //<NavBarController usuario={usuario} setUsuario={setUsuario}></NavBarController>
  
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
        <h1>hhhh</h1>
        {/* Aquí va tu contenido de inicio */}
        <Outlet context={{ usuario, setUsuario }}></Outlet>
      </div>
    </div>
  )
}

export default App
