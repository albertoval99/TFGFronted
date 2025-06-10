import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { partidosService } from "../../services/partidos.service";
import "./Calendario.css";
import { Mensaje } from "../Error/Mensaje";

export default function Calendario() {
    const { idLiga } = useParams();
    const [jornadas, setJornadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [slide, setSlide] = useState(0);
    const navigate = useNavigate();

    function formatearFechaLarga(fechaStr) {
        if (!fechaStr || typeof fechaStr !== "string") return "Fecha por determinar";
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(fechaStr)) {
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
    }

    function obtenerIndiceJornadaActual(jornadas) {
        const hoy = new Date();
        let idx = jornadas.findIndex(j => {
            const [year, month, day] = j.fecha.split("-");
            const fecha = new Date(Number(year), Number(month) - 1, Number(day));
            return fecha >= hoy;
        });
        if (idx === -1) idx = jornadas.length - 1;
        return idx >= 0 ? idx : 0;
    }

    function partidoSinJugar(partido) {
        return partido.goles_local == null || partido.goles_visitante == null;
    }

    function mostrarResultadoPartido(partido) {
        if (partidoSinJugar(partido)) {
            return "sin jugar";
        }
        return `${partido.goles_local} - ${partido.goles_visitante}`;
    }

    function irJornadaAnterior() {
        setSlide(s => Math.max(0, s - 1));
    }
    function irJornadaSiguiente() {
        setSlide(s => Math.min(jornadas.length - 1, s + 1));
    }

    // Para que cada fila sea de un color:
    function obtenerClaseBotonPartido(indice) {
        let clase = 'partido-boton-mini';
        if (indice % 2 === 0) {
            clase += ' gris';
        }
        return clase;
    }

    useEffect(() => {
        async function cargarTodasLasJornadas() {
            setLoading(true);
            setError(null);
            try {
                const nuevasJornadas = [];
                let numJornada = 1;
                let hayMasJornadas = true;
                while (hayMasJornadas) {
                    const response = await partidosService.getPartidosByJornada(idLiga, numJornada);
                    if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
                        nuevasJornadas.push({
                            numero: numJornada,
                            partidos: response.data,
                            fecha: response.data[0].fecha_partido
                        });
                        numJornada++;
                    } else {
                        hayMasJornadas = false;
                    }
                }
                setJornadas(nuevasJornadas);
                setSlide(obtenerIndiceJornadaActual(nuevasJornadas));
            } catch (err) {
                setError("Error al cargar el calendario");
                console.log("Error al cargar el calendario", err);
            } finally {
                setLoading(false);
            }
        }

        cargarTodasLasJornadas();
        // Asi no salta advertencia:
        // eslint-disable-next-line 
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#40c9ff]"></div>
            </div>
        );
    }

    return (
        <div className="calendario-padding calendario-carrusel-centrado">
            <Mensaje
                error={error}
                onClose={() => { setError("") }}
            />
            <div className="carousel-slider-mini">
                <div
                    className="carousel-track-mini"
                    style={{ transform: `translateX(-${slide * 100}%)` }}
                >
                    {jornadas.map((jornada) => (
                        <div className="carousel-slide-mini" key={jornada.numero}>
                            <div className="jornada-card-mini">
                                <div className="jornada-header-mini">
                                    <span>Jornada {jornada.numero}</span>
                                    <span>{formatearFechaLarga(jornada.fecha)}</span>
                                </div>
                                <div className="jornada-partidos-mini">
                                    {jornada.partidos.map((p, i) => (
                                        <button
                                            key={p.id_partido}
                                            className={obtenerClaseBotonPartido(i)}
                                            onClick={() => navigate(`/${p.id_partido}/estadisticas`)}
                                        >
                                            <span className="equipo-mini">{p.equipo_local}</span>
                                            <span className="resultado-mini">
                                                {mostrarResultadoPartido(p)}
                                            </span>
                                            <span className="equipo-mini">{p.equipo_visitante}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="carousel-botones">
                <button
                    className="carousel-boton-nav"
                    onClick={irJornadaAnterior}
                    disabled={slide === 0}
                >
                    Anterior jornada
                </button>
                <button
                    className="carousel-boton-nav"
                    onClick={irJornadaSiguiente}
                    disabled={slide === jornadas.length - 1}
                >
                    Siguiente jornada
                </button>
            </div>
        </div>
    );
}