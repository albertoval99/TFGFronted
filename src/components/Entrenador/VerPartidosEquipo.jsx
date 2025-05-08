import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { partidosService } from "../../services/partidos.service";
import "./Entrenador.css";
import hacerAlineacion from "/src/assets/alineacion.svg"
import arbitro from "/src/assets/arbitro.svg"

export default function VerPartidosEquipo() {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(sessionStorage.getItem("usuario"));
    if (!usuario?.id_equipo) {
      setError("No se ha encontrado el equipo en sesión");
      setLoading(false);
      return;
    }
    cargarPartidos(usuario.id_equipo);
  }, []);

  const cargarPartidos = async (idEquipo) => {
    setLoading(true);
    setError(null);
    try {
      const response = await partidosService.getPartidosByEquipo(idEquipo);
      if (response.status === 200 && Array.isArray(response.data)) {
        // Ordena por fecha
        const partidosOrdenados = response.data.sort((a, b) => new Date(a.fecha_partido) - new Date(b.fecha_partido));
        setPartidos(partidosOrdenados);

        // Selecciona el siguiente partido (el más próximo a hoy)
        const hoy = new Date();
        let idx = partidosOrdenados.findIndex(p => new Date(p.fecha_partido) >= hoy);
        if (idx === -1) idx = partidosOrdenados.length - 1; // Si todos son pasados, muestra el último
        setSlide(idx >= 0 ? idx : 0);
      } else {
        setError(response.message || "No se han encontrado partidos");
      }
    } catch (err) {
      setError("Error al cargar los partidos");
      console.log("Error al cargar los partidos", err);
    } finally {
      setLoading(false);
    }
  };

  const fechaLarga = (fechaStr) => {
    if (!fechaStr || typeof fechaStr !== "string") return "Fecha por determinar";
    if (fechaStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = fechaStr.split("/");
      const fecha = new Date(Number(year), Number(month) - 1, Number(day));
      if (isNaN(fecha.getTime())) return "Fecha por determinar";
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    return "Fecha por determinar";
  };

  const prevSlide = () => setSlide(s => Math.max(0, s - 1));
  const nextSlide = () => setSlide(s => Math.min(partidos.length - 1, s + 1));

  if (loading) {
    return (
      <div>
        <span>Cargando partidos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendario-error calendario-padding">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="calendario-layout">
      <div className="calendario-carrusel-mini">
        <div className="carousel-slider-mini">
          <div
            className="carousel-track-mini"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {partidos.map(p => (
              <div
                className="carousel-slide-mini"
                key={`${p.jornada}-${p.equipo_local}-${p.equipo_visitante}`}
              >
                <div className="card-match-compact">

                  {/* Jornada full-width */}
                  <div className="card-jornada-fullwidth">
                    Jornada {p.jornada}
                  </div>

                  {/* Árbitro justo debajo de la jornada */}
                  {p.arbitro_nombre && (
                    <div className="card-arbitro-above">
                      <img
                        src={arbitro}
                        alt="Icono árbitro"
                        className="arbitro-icon"
                      />
                      <span className="card-arbitro-nombre">
                        {p.arbitro_nombre} {p.arbitro_apellidos}
                      </span>
                    </div>
                  )}

                  {/* HEADER: Escudos grandes y VS perfectamente alineado */}
                  <div className="card-match-header-escudos">
                    <div className="card-match-team-solo">
                      <div className="escudo-contenedor grande local">
                        <img
                          src={p.escudo_local}
                          alt={`Escudo ${p.equipo_local}`}
                          className="card-match-escudo-grande"
                        />
                      </div>
                      <span className="card-match-rol">Local</span>
                    </div>
                    <div className="card-match-vs-grande">VS</div>
                    <div className="card-match-team-solo">
                      <div className="escudo-contenedor grande visitante">
                        <img
                          src={p.escudo_visitante}
                          alt={`Escudo ${p.equipo_visitante}`}
                          className="card-match-escudo-grande"
                        />
                      </div>
                      <span className="card-match-rol">Visitante</span>
                    </div>
                  </div>

                  {/* Contenido: fecha, hora y estadio */}
                  <div className="card-match-content">
                    <div className="card-info-central">
                      <div className="card-info-v-row">
                        {/* icono reloj */}
                        <svg
                          width="18" height="18" fill="none"
                          stroke="#40c9ff" strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path strokeLinecap="round" d="M12 6v6l4 2" />
                        </svg>
                        <span>
                          {fechaLarga(p.fecha_partido)}
                          {p.hora_partido && ` | ${p.hora_partido.slice(0, 5)}`}
                        </span>
                      </div>
                      <div className="card-info-v-row">
                        {/* icono estadio */}
                        <svg
                          width="18" height="18" fill="none"
                          stroke="#e81cff" strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M3 17V7a2 2 0 012-2h14a2 2 0 012 2v10"
                            strokeLinecap="round" strokeLinejoin="round"
                          />
                          <circle cx="12" cy="15" r="3" />
                        </svg>
                        <span>
                          {p.estadio}
                          <span className="label">
                            {" "}({p.estadio_ubicacion})
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Espacio extra antes del botón */}
                    <div style={{ height: "1.2rem" }} />

                    {/* Botón alineación */}
                    <div className="card-botones-bottom-center">
                      <button
                        onClick={() => navigate(`/alineacion/${p.id}`)}
                        className="card-boton"
                      >
                        <img
                          src={hacerAlineacion}
                          alt=""
                          className="card-boton-icon"
                        />
                        Hacer alineación
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navegación */}
        <div className="carousel-botones">
          <button
            className="carousel-boton-nav"
            onClick={prevSlide}
            disabled={slide === 0}
          >
            &larr;
          </button>
          <button
            className="carousel-boton-nav"
            onClick={nextSlide}
            disabled={slide === partidos.length - 1}
          >
            &rarr;
          </button>
        </div>
      </div>
    </div>
  );

}