import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router'
//import NavBarController from './components/NavBar/NavBarController'

function App() {
  const [usuario,setUsuario]=useState(null)

  /** 
  useEffect(()=>{
    get("/usuarios", setUsuario, "Error imprimiendo Usuarios")
  },[])*/

//<NavBarController usuario={usuario} setUsuario={setUsuario}></NavBarController>
  return (
    <>
    
    
    <Outlet context={{usuario,setUsuario}}></Outlet>
    </>
  )
}

export default App
