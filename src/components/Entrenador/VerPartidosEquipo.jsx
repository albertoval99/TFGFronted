import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { partidosService } from "../../services/partidos.service";
import "./Entrenador.css";

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
        <div className="calendario-carrusel-centrado">
          <div className="carousel-slider-mini">
            <div
              className="carousel-track-mini"
              style={{
                transform: `translateX(-${slide * 100}%)`
              }}
            >
              {partidos.map((partido) => (
                <div className="carousel-slide-mini" key={partido.jornada + partido.equipo_local + partido.equipo_visitante}>
                  <div className="jornada-card-mini">
                    {/* LADO IZQUIERDO: Equipos y escudos */}
                    <div style={{
                      flex: 1.2,
                      background: "#18181b",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "40px",
                      height: "100%"
                    }}>
                      <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "8px"}}>
                        <img
                          src={partido.escudo_local}
                          alt={`Escudo ${partido.equipo_local}`}
                          style={{
                            width: "96px",
                            height: "96px",
                            objectFit: "contain",
                            background: "#fff",
                            borderRadius: "50%",
                            border: "2px solid #40c9ff",
                            boxShadow: "0 2px 8px #0002"
                          }}
                        />
                        <span style={{fontWeight: "bold", color: "#fff", fontSize: "1.1rem", textAlign: "center", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{partido.equipo_local}</span>
                        <span style={{fontSize: "0.8rem", color: "#a3a3a3"}}>Local</span>
                      </div>
                      <span style={{fontSize: "2.2rem", fontWeight: 800, color: "#40c9ff"}}>VS</span>
                      <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "8px"}}>
                        <img
                          src={partido.escudo_visitante}
                          alt={`Escudo ${partido.equipo_visitante}`}
                          style={{
                            width: "96px",
                            height: "96px",
                            objectFit: "contain",
                            background: "#fff",
                            borderRadius: "50%",
                            border: "2px solid #e81cff",
                            boxShadow: "0 2px 8px #0002"
                          }}
                        />
                        <span style={{fontWeight: "bold", color: "#fff", fontSize: "1.1rem", textAlign: "center", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{partido.equipo_visitante}</span>
                        <span style={{fontSize: "0.8rem", color: "#a3a3a3"}}>Visitante</span>
                      </div>
                    </div>
                    {/* LADO DERECHO: Info partido */}
                    <div style={{
                      flex: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                      padding: "40px 48px"
                    }}>
                      <div>
                        <span style={{
                          padding: "6px 18px",
                          borderRadius: "999px",
                          background: "linear-gradient(90deg, #e81cff, #40c9ff)",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "1rem",
                          boxShadow: "0 2px 8px #40c9ff22"
                        }}>
                          Jornada {partido.jornada}
                        </span>
                      </div>
                      <div>
                        <div style={{display: "flex", alignItems: "center", gap: "10px", margin: "32px 0 18px 0"}}>
                          <svg width="22" height="22" fill="none" stroke="#40c9ff" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <path strokeLinecap="round" d="M12 6v6l4 2"/>
                          </svg>
                          <span style={{color: "#e5e5e5", fontWeight: 500}}>{fechaLarga(partido.fecha_partido)}</span>
                          {partido.hora_partido && (
                            <>
                              <span style={{color: "#a3a3a3"}}>|</span>
                              <span style={{color: "#e5e5e5", fontWeight: 500}}>{partido.hora_partido.slice(0,5)}</span>
                            </>
                          )}
                        </div>
                        <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px"}}>
                          <svg width="22" height="22" fill="none" stroke="#e81cff" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M3 17V7a2 2 0 012-2h14a2 2 0 012 2v10" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="15" r="3"/>
                          </svg>
                          <span style={{color: "#e5e5e5"}}>{partido.estadio}</span>
                          <span style={{color: "#a3a3a3", fontSize: "0.9rem"}}>({partido.estadio_ubicacion})</span>
                        </div>
                        {partido.arbitro_nombre && (
                          <div style={{display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px"}}>
                            <svg width="22" height="22" fill="none" stroke="#40c9ff" strokeWidth="2" viewBox="0 0 24 24">
                              <circle cx="12" cy="8" r="4"/>
                              <path d="M6 20v-2a4 4 0 014-4h0a4 4 0 014 4v2" strokeLinecap="round"/>
                            </svg>
                            <span style={{color: "#e5e5e5"}}>{partido.arbitro_nombre} {partido.arbitro_apellidos}</span>
                          </div>
                        )}
                      </div>
                      <div style={{display: "flex", gap: "18px"}}>
                        <button
                          style={{
                            padding: "10px 24px",
                            background: "linear-gradient(90deg, #e81cff, #40c9ff)",
                            color: "#fff",
                            borderRadius: "10px",
                            fontWeight: 600,
                            fontSize: "1rem",
                            border: "none",
                            boxShadow: "0 2px 8px #40c9ff22",
                            cursor: "pointer"
                          }}
                          onClick={() => navigate(`/partido/${partido.id}`)}
                        >
                          Ver partido
                        </button>
                        <button
                          style={{
                            padding: "10px 24px",
                            background: "#232531",
                            color: "#40c9ff",
                            border: "2px solid #40c9ff",
                            borderRadius: "10px",
                            fontWeight: 600,
                            fontSize: "1rem",
                            cursor: "pointer"
                          }}
                          onClick={() => navigate(`/alineacion/${partido.id}`)}
                        >
                          Hacer alineación
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="carousel-botones">
            <button
              className="carousel-boton-nav"
              onClick={prevSlide}
              disabled={slide === 0}
            >
              Partido anterior
            </button>
            <button
              className="carousel-boton-nav"
              onClick={nextSlide}
              disabled={slide === partidos.length - 1}
            >
              Siguiente partido
            </button>
          </div>
        </div>
      );
}