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
import RegistroArbitro from './components/Admin/RegistroArbitro.jsx';
import RegistroEntrenador from './components/Admin/RegistroEntrenador.jsx';
import RegistroJugador from './components/Entrenador/RegistroJugador.jsx';
import RegistroLiga from './components/Admin/RegistroLiga.jsx';
import RegistroEquipo from './components/Admin/RegistroEquipo.jsx';
import CrearEntrenamiento from './components/Entrenador/CrearEntrenamiento.jsx';
import VerEntrenamientos from './components/Entrenador/VerEntrenamientos.jsx';
import VerAsistencias from './components/Entrenador/VerAsistencias.jsx';



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
        path:"/registroArbitro",
        element:<RegistroArbitro></RegistroArbitro>
      },
      {
        path:"/registroEntrenador",
        element:<RegistroEntrenador></RegistroEntrenador>
      },
      {
        path:"/registroJugador",
        element:<RegistroJugador></RegistroJugador>
      },
      {
        path:"/registroLiga",
        element:<RegistroLiga></RegistroLiga>
      },
      {
        path:"/registroEquipo",
        element:<RegistroEquipo></RegistroEquipo>
      },
      {
        path:"/crearEntrenamiento",
        element:<CrearEntrenamiento></CrearEntrenamiento>
      },
      {
        path:"/verEntrenamientos",
        element:<VerEntrenamientos></VerEntrenamientos>
      },
      {
        path:"/verAsistencias",
        element:<VerAsistencias></VerAsistencias>
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
