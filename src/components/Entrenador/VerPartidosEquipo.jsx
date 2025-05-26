import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { partidosService } from "../../services/partidos.service";
import "./Entrenador.css";
import hacerAlineacion from "/src/assets/alineacion.svg";
import arbitro from "/src/assets/arbitro.svg";
import { Mensaje } from "../Error/Mensaje";

export default function VerPartidosEquipo() {
  const [partidos, setPartidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
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
        const partidosOrdenados = response.data.sort(
          (a, b) => new Date(a.fecha_partido) - new Date(b.fecha_partido)
        );
        setPartidos(partidosOrdenados);

        // Selecciona el partido más próximo a hoy (sin ser pasado)
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        let idx = partidosOrdenados.findIndex((p) => {
          let fecha;
          if (p.fecha_partido.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const [day, month, year] = p.fecha_partido.split("/");
            fecha = new Date(Number(year), Number(month) - 1, Number(day));
          } else if (p.fecha_partido.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = p.fecha_partido.split("-");
            fecha = new Date(Number(year), Number(month) - 1, Number(day));
          } else {
            fecha = new Date(p.fecha_partido);
          }
          return fecha >= hoy;
        });
        if (idx === -1) idx = partidosOrdenados.length - 1;
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
      return fecha.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    if (fechaStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = fechaStr.split("-");
      const fecha = new Date(Number(year), Number(month) - 1, Number(day));
      if (isNaN(fecha.getTime())) return "Fecha por determinar";
      return fecha.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return "Fecha por determinar";
  };

  // Devuelve true si el usuario puede hacer la alineación (antes de la fecha/hora del partido)
  function puedeHacerAlineacion(partido) {
    let fechaPartido;
    if (partido.fecha_partido.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const [day, month, year] = partido.fecha_partido.split("/");
      fechaPartido = new Date(Number(year), Number(month) - 1, Number(day));
    } else if (partido.fecha_partido.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = partido.fecha_partido.split("-");
      fechaPartido = new Date(Number(year), Number(month) - 1, Number(day));
    } else {
      fechaPartido = new Date(partido.fecha_partido);
    }
    if (partido.hora_partido) {
      const [h, m] = partido.hora_partido.split(":");
      fechaPartido.setHours(Number(h), Number(m), 0, 0);
    } else {
      fechaPartido.setHours(0, 0, 0, 0);
    }
    const ahora = new Date();
    return ahora < fechaPartido;
  }

  const prevSlide = () => setSlide((s) => Math.max(0, s - 1));
  const nextSlide = () => setSlide((s) => Math.min(partidos.length - 1, s + 1));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#40c9ff]"></div>
      </div>
    );
  }

  return (
    <>
      <Mensaje
        error={error}
        success={success}
        onClose={() => { setError(""); setSuccess(""); }}
      />
      <div className="vpe-layout">
        <div className="vpe-carrusel-mini">
          <div className="vpe-carousel-slider">
            <div
              className="vpe-carousel-track"
              style={{ transform: `translateX(-${slide * 100}%)` }}
            >
              {partidos.map((p) => {
                return (
                  <div
                    className="vpe-carousel-slide"
                    key={`${p.jornada}-${p.equipo_local}-${p.equipo_visitante}`}
                  >
                    <div className="vpe-card-match">
                      {/* Jornada full-width */}
                      <div className="vpe-card-jornada">
                        Jornada {p.jornada}
                      </div>

                      {/* Árbitro justo debajo de la jornada */}
                      {p.arbitro_nombre && (
                        <div className="vpe-card-arbitro">
                          <img
                            src={arbitro}
                            alt="Icono árbitro"
                            className="vpe-arbitro-icon"
                          />
                          <span className="vpe-card-arbitro-nombre">
                            {p.arbitro_nombre} {p.arbitro_apellidos}
                          </span>
                        </div>
                      )}

                      {/* HEADER: Escudos grandes y VS perfectamente alineado */}
                      <div className="vpe-card-header-escudos">
                        <div className="vpe-card-team">
                          <div className="vpe-escudo-contenedor grande local">
                            <img
                              src={p.escudo_local}
                              alt={`Escudo ${p.equipo_local}`}
                              className="vpe-card-escudo-grande"
                            />
                          </div>
                          <span className="vpe-card-rol">Local</span>
                        </div>
                        <div className="vpe-card-vs-grande">VS</div>
                        <div className="vpe-card-team">
                          <div className="vpe-escudo-contenedor grande visitante">
                            <img
                              src={p.escudo_visitante}
                              alt={`Escudo ${p.equipo_visitante}`}
                              className="vpe-card-escudo-grande"
                            />
                          </div>
                          <span className="vpe-card-rol">Visitante</span>
                        </div>
                      </div>

                      {/* Contenido: fecha, hora y estadio */}
                      <div className="vpe-card-content">
                        <div className="vpe-card-info-central">
                          <div className="vpe-card-info-row">
                            {/* icono reloj */}
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              stroke="#40c9ff"
                              strokeWidth="2"
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
                          <div className="vpe-card-info-row">
                            {/* icono estadio */}
                            <svg
                              width="18"
                              height="18"
                              fill="none"
                              stroke="#e81cff"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M3 17V7a2 2 0 012-2h14a2 2 0 012 2v10"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle cx="12" cy="15" r="3" />
                            </svg>
                            <span>
                              {p.estadio}
                              <span className="vpe-label">
                                {" "}
                                ({p.estadio_ubicacion})
                              </span>
                            </span>
                          </div>
                        </div>
                        <div style={{ height: "1.2rem" }} />
                        <div className="vpe-card-botones-bottom-center">
                          <button
                            onClick={() => {
                              if (puedeHacerAlineacion(p)) {
                                setError("");
                                setSuccess("");
                                navigate(`/registrarAlineacion/${p.id_partido}`);
                              } else {
                                setError(
                                  "Solo puedes hacer la alineación antes de la hora del partido.Este partido ya se ha jugado o esta en juego"
                                );
                                setSuccess("");
                              }
                            }}
                            className="vpe-card-boton"
                          >
                            <img
                              src={hacerAlineacion}
                              alt=""
                              className="vpe-card-boton-icon"
                            />
                            Hacer alineación
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navegación */}
          <div className="vpe-carousel-botones">
            <button
              className="vpe-carousel-boton-nav"
              onClick={prevSlide}
              disabled={slide === 0}
            >
              &larr;
            </button>
            <button
              className="vpe-carousel-boton-nav"
              onClick={nextSlide}
              disabled={slide === partidos.length - 1}
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}