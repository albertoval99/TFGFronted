import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { alineacionesService } from "../../services/alineaciones.service";
import { userService } from "../../services/usuarios.service";
import "./Alineacion.css";

export default function RegistrarAlineacion() {
    const { id_partido } = useParams();
    const navigate = useNavigate();

    const [jugadores, setJugadores] = useState([]);
    const [estadoJugadores, setEstadoJugadores] = useState({}); // { id_jugador: "no" | "titular" | "suplente" }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchJugadores = async () => {
            try {
                const response = await userService.getJugadoresByEquipo();
                if (response.status === 200) {
                    setJugadores(response.jugadores);
                    const inicial = {};
                    for (let i = 0; i < response.jugadores.length; i++) {
                        inicial[response.jugadores[i].id_jugador] = "no";
                    }
                    setEstadoJugadores(inicial);
                    setError(null);
                } else {
                    setError(response.message);
                    setJugadores([]);
                }
            } catch (err) {
                setError("Error al cargar los jugadores");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJugadores();
    }, []);

    const cicloEstado = (actual) => {
        if (actual === "no") return "titular";
        if (actual === "titular") return "suplente";
        return "no";
    };

    const toggleJugador = (id_jugador) => {
        setEstadoJugadores((prev) => {
            const nuevoEstado = cicloEstado(prev[id_jugador]);

            let titularesCount = 0;
            let suplentesCount = 0;
            for (const key in prev) {
                if (key === String(id_jugador)) {
                    if (nuevoEstado === "titular") titularesCount++;
                    if (nuevoEstado === "suplente") suplentesCount++;
                } else {
                    if (prev[key] === "titular") titularesCount++;
                    if (prev[key] === "suplente") suplentesCount++;
                }
            }

            if (titularesCount > 11) {
                setError("No puedes tener más de 11 titulares");
                setSuccess("");
                return prev;
            }
            if (suplentesCount > 7) {
                setError("No puedes tener más de 7 suplentes");
                setSuccess("");
                return prev;
            }

            setError(null);
            setSuccess("");
            return { ...prev, [id_jugador]: nuevoEstado };
        });
    };

    const guardarAlineacion = async () => {
        const titulares = [];
        const suplentes = [];
        for (const key in estadoJugadores) {
            if (estadoJugadores[key] === "titular") titulares.push(Number(key));
            else if (estadoJugadores[key] === "suplente") suplentes.push(Number(key));
        }

        if (titulares.length !== 11) {
            setError("Debe seleccionar exactamente 11 titulares");
            setSuccess("");
            return;
        }
        if (suplentes.length > 7) {
            setError("No puede haber más de 7 suplentes");
            setSuccess("");
            return;
        }

        setError(null);
        setSuccess("");

        try {
            for (let i = 0; i < titulares.length; i++) {
                await alineacionesService.registrarAlineacion({
                    id_partido: Number(id_partido),
                    id_jugador: titulares[i],
                    titular: true,
                });
            }
            for (let i = 0; i < suplentes.length; i++) {
                await alineacionesService.registrarAlineacion({
                    id_partido: Number(id_partido),
                    id_jugador: suplentes[i],
                    titular: false,
                });
            }
            setSuccess("Alineación guardada correctamente");
            navigate(`/gestionarPartidos}`);
        } catch (err) {
            setError("Error al guardar la alineación");
            console.error(err);
        }
    };

    if (loading) return <p className="ra-loading">Cargando jugadores...</p>;

    let titularesCount = 0;
    let suplentesCount = 0;
    for (const key in estadoJugadores) {
        if (estadoJugadores[key] === "titular") titularesCount++;
        else if (estadoJugadores[key] === "suplente") suplentesCount++;
    }

    return (
        <div className="ra-container">
            {(error || success) && (
                <div className="flex flex-col w-60 sm:w-72 text-[10px] sm:text-xs z-50 fixed bottom-4 right-4">
                    <div className={`cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-lg px-[10px] bg-[#232531]`}>
                        <div className="flex items-center flex-1">
                            <div className={`bg-white/5 backdrop-blur-xl p-1 rounded-lg ${error ? "text-[#d65563]" : "text-green-500"}`}>
                                {error ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                )}
                            </div>
                            <div className="text-center ml-3">
                                <p className="text-white">{String(error || success)}</p>
                            </div>
                        </div>
                        <button
                            className="text-gray-600 hover:bg-white/10 p-1 rounded-md transition-colors ease-linear cursor-pointer"
                            onClick={() => {
                                setError("");
                                setSuccess("");
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <h1 className="ra-title">Crear Alineación</h1>

            <div className="ra-counters">
                <div>Titulares: {titularesCount} / 11</div>
                <div>Suplentes: {suplentesCount} / 7</div>
            </div>

            <div className="ra-list">
                {jugadores.map((jugador) => {
                    const estado = estadoJugadores[jugador.id_jugador];
                    return (
                        <div
                            key={jugador.id_jugador}
                            className={`ra-player-card ${estado === "titular"
                                    ? "ra-titular"
                                    : estado === "suplente"
                                        ? "ra-suplente"
                                        : "ra-no"
                                }`}
                            onClick={() => toggleJugador(jugador.id_jugador)}
                            title="Click para cambiar estado: No seleccionado → Titular → Suplente"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    toggleJugador(jugador.id_jugador);
                                }
                            }}
                        >
                            <div className="ra-dorsal">
                                <svg className="ra-dorsal-svg" viewBox="0 0 40 40" fill="none" aria-hidden="true">
                                    <path d="M10 5 L30 5 L35 15 L32 35 L8 35 L5 15 Z" fill="#232531" stroke="#40c9ff" strokeWidth="2" />
                                    <rect x="13" y="5" width="14" height="6" rx="2" fill="#40c9ff" />
                                </svg>
                                <span className="ra-dorsal-text">{jugador.numero_camiseta}</span>
                            </div>
                            <div className="ra-player-info">
                                <span className="ra-player-name">{jugador.nombre} {jugador.apellidos}</span>
                                <span className="ra-player-position">{jugador.posicion}</span>
                            </div>
                            <div className="ra-player-status">
                                {estado === "titular" ? "Titular" : estado === "suplente" ? "Suplente" : ""}
                            </div>
                        </div>
                    );
                })}
            </div>

            <button className="ra-save-btn" onClick={guardarAlineacion}>
                Guardar Alineación
            </button>
        </div>
    );
}