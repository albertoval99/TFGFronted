import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router'
import NavBarController from './components/NavBar/NavBarController'

function App() {
  const [usuario,setUsuario]=useState(null)

  /** 
  useEffect(()=>{
    get("/usuarios", setUsuario, "Error imprimiendo Usuarios")
  },[])*/


  return (
    <>
    <NavBarController usuario={usuario} setUsuario={setUsuario}></NavBarController>
    <Outlet context={{usuario,setUsuario}}></Outlet>
    </>
  )
}

export default App
