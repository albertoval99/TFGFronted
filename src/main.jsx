import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router';
import Login from './components/Login/Login.jsx';
import InicioCards from './components/InicioCards/InicioCards.jsx';
import Admin from './components/Admin/Admin.jsx';
import Jugador from './components/Jugador/Jugador.jsx';
import Arbitro from './components/Arbitro/Arbitro.jsx';
import Entrenador from './components/Entrenador/Entrenador.jsx';
import RegistroEntrenador from './components/Admin/RegistroEntrenador.jsx';
import RegistroArbitro from './components/Admin/RegistroArbitro.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <InicioCards />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path:"/admin",
        element:<Admin></Admin>
      },
      {
        path:"/jugador",
        element:<Jugador></Jugador>
      },
      {
        path:"/arbitro",
        element:<Arbitro></Arbitro>
      },
      {
        path:"/entrenador",
        element:<Entrenador></Entrenador>
      },
      {
        path:"/registrarEntrenador",
        element:<RegistroEntrenador></RegistroEntrenador>
      },
      {
        path:"/registrarArbitro",
        element:<RegistroArbitro></RegistroArbitro>
      }
    ],
  },
  {
    path:"*",
    element:<h1>Esta ruta no existe</h1>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
