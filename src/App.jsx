// src/App.jsx
import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router'
import Aurora from './components/Aurora/Aurora'
import NavBarSinUser from './components/NavBar/navBarSinUser'
import SpotlightCard from './components/SpotlightCard/SpotlightCard'
import { Link } from 'react-router'

function App() {
  const [usuario, setUsuario] = useState(null)
  
  const services = [
    {
      title: "Diseño Web",
      description: "Creamos sitios web modernos y responsivos que destacan tu marca.",
      buttonText: "Ver más",
      link: "/servicios/diseno-web"
    },
    {
      title: "Desarrollo Móvil",
      description: "Aplicaciones nativas y multiplataforma con interfaces intuitivas.",
      buttonText: "Explorar",
      link: "/servicios/desarrollo-movil"
    },
    {
      title: "Marketing Digital",
      description: "Estrategias personalizadas para aumentar tu presencia online.",
      buttonText: "Descubrir",
      link: "/servicios/marketing"
    },
    {
      title: "Consultoría IT",
      description: "Asesoramiento experto para optimizar tus procesos tecnológicos.",
      buttonText: "Contactar",
      link: "/servicios/consultoria"
    }
  ];

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
        <div className="w-full pt-20 pb-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#CE32FD] to-[#00D8FF] text-transparent bg-clip-text">
              Soluciones Digitales Innovadoras
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Transformando ideas en experiencias digitales excepcionales
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-16 px-4">
            {services.map((service, index) => (
              <SpotlightCard 
                key={index} 
                className="card-spotlight"
                spotlightColor={`rgba(${index % 2 === 0 ? '232, 28, 255' : '64, 201, 255'}, 0.25)`}
              >
                <div>
                  <h2 className="heading bg-gradient-to-r from-[#e81cff] to-[#40c9ff] text-transparent bg-clip-text">
                    {service.title}
                  </h2>
                  <p>
                    {service.description}
                  </p>
                </div>
                <div className="button-container">
                  <Link to={service.link} className="text-white hover:text-purple-400 transition-colors">
                    <button className="button">{service.buttonText}</button>
                  </Link>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
        
        <Outlet context={{ usuario, setUsuario }}></Outlet>
      </div>
    </div>
  )
}

export default App