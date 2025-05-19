import { Link, useNavigate } from 'react-router';
import './InicioCards.css';
import logoFaf from "/src/assets/logoFaf.png"

export default function InicioCards() {

  const navigate = useNavigate();

  const services = [
    {
      title: "¿Eres Entrenador?",
      description: "Gestiona tus equipos, organiza entrenamientos y lidera a tus jugadores hacia el éxito. Todo lo que necesitas para ser el mejor estratega está aquí.",
      buttonText: "Iniciar Sesion",
      link: "/login"
    },
    {
      title: "¿Eres Árbitro?",
      description: "Controla los partidos, aplica las reglas y asegura el juego limpio en cada encuentro. Tu rol es clave para mantener la justicia en el campo.",
      buttonText: "Iniciar Sesion",
      link: "/login"
    },
    {
      title: "¿Eres Jugador?",
      description: "Consulta tus estadísticas, organiza tus partidos y mantente conectado con tu equipo. Todo lo que necesitas para destacar en el juego está aquí.",
      buttonText: "Iniciar Sesion",
      link: "/login"
    },
    {
      title: "¿Eres Administrador?",
      description: "Gestiona usuarios, organiza competiciones y supervisa el sistema. Todo el control necesario para que todo funcione perfectamente está aquí.",
      buttonText: "Iniciar Sesion",
      link: "/login"
    }
  ];

  return (
    <div className="w-full pt-20 pb-16">
      {/* TITULO Y DESCRIPCION DE LA APLICACION
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#CE32FD] to-[#00D8FF] text-transparent bg-clip-text">
          Revoluciona el Mundo del Fútbol
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          FootballZone es la plataforma digital diseñada para los que buscan llevar su experiencia futbolística al siguiente nivel. Gestiona equipos, organiza partidos, consulta estadísticas en tiempo real y mantén todo bajo control desde un solo lugar. Con herramientas innovadoras y fáciles de usar, transformamos la manera en que vives y gestionas el fútbol. ¡Únete a la comunidad que está cambiando el juego!
        </p>
      </div>
      */}
      {/* Card de la Liga */}
      <div className="liga-inicio-card">
        <div className="liga-inicio-card-content">
          {/* Izquierda: Logo y datos */}
          <div className="liga-inicio-card-left">
            <div className="liga-inicio-logo-box">
              <img src={logoFaf} alt="Logo de la Liga" className="liga-inicio-logo" />
            </div>
            <div>
              <h1 className="liga-inicio-nombre">2ª REGIONAL HUESCA</h1>
              <h2 className="liga-inicio-grupo">GRUPO 2-1</h2>
            </div>
          </div>
          {/* Derecha: Botones */}
          <div className="liga-inicio-card-right">
            <button
              type="button"
              onClick={() => navigate('/calendario2Reg2-1')}
              className="liga-inicio-btn"
            >
              <span>Ver Calendario</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="liga-inicio-btn-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 12H6.75m7.5 0l-3-3m3 3l-3 3" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => navigate('/verClasificacion')}
              className="liga-inicio-btn"
            >
              <span>Ver Clasificacion</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="liga-inicio-btn-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 12H6.75m7.5 0l-3-3m3 3l-3 3" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => navigate('/actualizarPerfil')}
              className="liga-inicio-btn"
            >
              <span>Ver Ranking de Estadisticas</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="liga-inicio-btn-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 12H6.75m7.5 0l-3-3m3 3l-3 3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-16 px-4">
        {services.map((service, index) => (
          <div key={index} className="card">
            <p className="heading bg-gradient-to-r from-[#e81cff] to-[#40c9ff] text-transparent bg-clip-text text-center">
              {service.title}
            </p>
            <p>
              {service.description}
            </p>
            <div className="button-container">
              <Link to={service.link}>
                <div className="relative group">
                  <button className="relative inline-block p-px font-semibold leading-6 text-white bg-neutral-900 shadow-2xl cursor-pointer rounded-2xl shadow-purple-900 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-purple-600">
                    <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#CE32FD] to-[#00D8FF] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                    <span className="relative z-10 block px-6 py-3 rounded-2xl bg-neutral-950">
                      <div className="relative z-10 flex items-center space-x-3">
                        <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-[#CE32FD]">
                          {service.buttonText}
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-[#00D8FF]"
                        >
                          <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
                        </svg>
                      </div>
                    </span>
                  </button>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}