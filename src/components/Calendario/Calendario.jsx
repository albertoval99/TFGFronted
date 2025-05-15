import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { partidosService } from "../../services/partidos.service";
import "./Calendario.css";

export default function Calendario() {
    const idLiga = 3;
    const [jornadas, setJornadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [slide, setSlide] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        cargarTodasLasJornadas();
    }, []);

    const cargarTodasLasJornadas = async () => {
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

            // Selecciona la jornada más próxima a hoy (sin ser pasada)
            const hoy = new Date();
            let idx = nuevasJornadas.findIndex(j => {
                const [year, month, day] = j.fecha.split("-");
                const fecha = new Date(Number(year), Number(month) - 1, Number(day));
                return fecha >= hoy;
            });
            if (idx === -1) idx = nuevasJornadas.length - 1; // Si todas son pasadas, muestra la última
            setSlide(idx >= 0 ? idx : 0);
        } catch (err) {
            setError("Error al cargar el calendario");
            console.log("Error al cargar el calendario", err);
        } finally {
            setLoading(false);
        }
    };

    const fechaLarga = (fechaStr) => {
        if (!fechaStr || typeof fechaStr !== "string") return "Fecha por determinar";
        // Si es DD/MM/YYYY
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
    const nextSlide = () => setSlide(s => Math.min(jornadas.length - 1, s + 1));

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#40c9ff]"></div>
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
        <div className="calendario-padding calendario-carrusel-centrado">
            <div className="carousel-slider-mini">
                <div
                    className="carousel-track-mini"
                    style={{
                        transform: `translateX(-${slide * 100}%)`
                    }}
                >
                    {jornadas.map((jornada) => (
                        <div className="carousel-slide-mini" key={jornada.numero}>
                            <div className="jornada-card-mini">
                                <div className="jornada-header-mini">
                                    <span>Jornada {jornada.numero}</span>
                                    <span>{fechaLarga(jornada.fecha)}</span>  
                                </div>
                                <div className="jornada-partidos-mini">
                                    {jornada.partidos.map((p, i) => {
                                        const sinJugar = p.goles_local == null || p.goles_visitante == null;
                                        return (
                                            <button
                                                key={p.id_partido}
                                                className={`partido-boton-mini ${i % 2 === 0 ? 'gris' : ''}`}
                                                onClick={() => navigate(`/${p.id_partido}/estadisticas`)}
                                            >
                                                <span className="equipo-mini">{p.equipo_local}</span>
                                                <span className="resultado-mini">
                                                    {sinJugar
                                                        ? "sin jugar"
                                                        : `${p.goles_local} - ${p.goles_visitante}`
                                                    }
                                                </span>
                                                <span className="equipo-mini">{p.equipo_visitante}</span>
                                            </button>
                                        );
                                    })}
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
                    Anterior jornada
                </button>
                <button
                    className="carousel-boton-nav"
                    onClick={nextSlide}
                    disabled={slide === jornadas.length - 1}
                >
                    Siguiente jornada
                </button>
            </div>
        </div>
    );
}