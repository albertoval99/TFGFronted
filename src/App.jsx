import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router'
import Aurora from './components/Aurora/Aurora'
import NavBarSinUser from './components/NavBar/navBarSinUser'
import InicioCards from './components/InicioCards/InicioCards'

function App() {
  const [usuario, setUsuario] = useState(null)
  
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
        <InicioCards />
        <Outlet context={{ usuario, setUsuario }}></Outlet>
      </div>
    </div>
  )
}

export default App