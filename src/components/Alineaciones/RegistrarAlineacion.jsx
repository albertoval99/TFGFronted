import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { alineacionesService } from "../../services/alineaciones.service";
import { userService } from "../../services/usuarios.service";
import "./Alineacion.css";

export default function RegistrarAlineacion() {
    const { id_partido } = useParams();
    const navigate = useNavigate();

    const [jugadores, setJugadores] = useState([]);
    const [estadoJugadores, setEstadoJugadores] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");

    const POSICION_COLORS = {
        PT: "bg-blue-600/20 text-blue-400",
        DFC: "bg-green-600/20 text-green-400",
        LI: "bg-yellow-600/20 text-yellow-500",
        LD: "bg-yellow-600/20 text-yellow-500",
        MC: "bg-purple-600/20 text-purple-400",
        MCD: "bg-indigo-600/20 text-indigo-400",
        MI: "bg-pink-600/20 text-pink-400",
        MD: "bg-pink-600/20 text-pink-400",
        EI: "bg-orange-600/20 text-orange-400",
        ED: "bg-orange-600/20 text-orange-400",
        DC: "bg-red-600/20 text-red-400",
    };

    useEffect(() => {
        async function cargarDatos() {
            if (!id_partido) {
                setError("No se encontró el partido");
                setLoading(false);
                return;
            }
            try {
                const resJugadores = await userService.getJugadoresByEquipo();
                if (resJugadores.status !== 200) {
                    setError("Error al cargar jugadores");
                    setLoading(false);
                    return;
                }
                const jugadoresData = resJugadores.jugadores;
                const estadoInicial = {};
                jugadoresData.forEach((j) => {
                    estadoInicial[j.id_jugador] = "no";
                });

                try {
                    const resAlineacion = await alineacionesService.getAlineacionesByPartido(id_partido);
                    if (Array.isArray(resAlineacion)) {
                        resAlineacion.forEach((a) => {
                            estadoInicial[a.id_jugador] = a.es_titular ? "titular" : "suplente";
                        });
                    }
                } catch {
                    // No hay alineación previa
                }

                setJugadores(jugadoresData);
                setEstadoJugadores(estadoInicial);
                setError(null);
            } catch (e) {
                setError("Error inesperado al cargar datos");
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        cargarDatos();
    }, [id_partido]);

    const toggleTitular = (id_jugador) => {
        setEstadoJugadores((prev) => {
            const current = prev[id_jugador];
            const titularesCount = Object.values(prev).filter((e) => e === "titular").length;
            if (current === "titular") {
                setError(null);
                return { ...prev, [id_jugador]: "no" };
            }
            if (titularesCount >= 11) {
                setError("No puedes tener más de 11 titulares");
                return prev;
            }
            setError(null);
            return { ...prev, [id_jugador]: "titular" };
        });
    };

    const toggleSuplente = (id_jugador) => {
        setEstadoJugadores((prev) => {
            const current = prev[id_jugador];
            const suplentesCount = Object.values(prev).filter((e) => e === "suplente").length;
            if (current === "suplente") {
                setError(null);
                return { ...prev, [id_jugador]: "no" };
            }
            if (suplentesCount >= 7) {
                setError("No puedes tener más de 7 suplentes");
                return prev;
            }
            setError(null);
            return { ...prev, [id_jugador]: "suplente" };
        });
    };

    const guardarAlineacion = async () => {
        setError(null);
        setSuccess("");
        try {
            const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
            const id_equipo = usuario.equipo?.id_equipo;
            if (!id_equipo) {
                setError("No se encontró el equipo del usuario");
                return;
            }

            const titulares = Object.entries(estadoJugadores)
                .filter(([, estado]) => estado === "titular")
                .map(([id_jugador]) => Number(id_jugador));

            const suplentes = Object.entries(estadoJugadores)
                .filter(([, estado]) => estado === "suplente")
                .map(([id_jugador]) => Number(id_jugador));

            if (titulares.length !== 11) {
                setError("Tienes que tener 11 titulares exactamente");
                return;
            }
            if (suplentes.length > 7) {
                setError("No puedes tener más de 7 suplentes");
                return;
            }

            const alineaciones = [
                ...titulares.map((id_jugador) => ({
                    id_partido,
                    id_jugador,
                    id_equipo,
                    es_titular: true,
                })),
                ...suplentes.map((id_jugador) => ({
                    id_partido,
                    id_jugador,
                    id_equipo,
                    es_titular: false,
                })),
            ];

            await Promise.all(
                alineaciones.map((alineacion) =>
                    alineacionesService.registrarAlineacion(alineacion)
                )
            );

            setSuccess("Alineación guardada correctamente");
            setTimeout(() => {
                navigate("/gestionarPartidos");
            }, 3000);
        } catch (e) {
            setError(e.message || "Error al guardar la alineación");
            console.error(e);
        }
    };

    if (loading) return <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#40c9ff]"></div>
    </div>;

    const titularesCount = Object.values(estadoJugadores).filter((e) => e === "titular").length;
    const suplentesCount = Object.values(estadoJugadores).filter((e) => e === "suplente").length;

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
                        <div key={jugador.id_jugador} className="ra-player-card">
                            <div className="ra-dorsal-container" aria-hidden="true">
                                <svg className="ra-dorsal-svg" viewBox="0 0 40 40" fill="none">
                                    <path d="M10 5 L30 5 L35 15 L32 35 L8 35 L5 15 Z" fill="#232531" stroke="#40c9ff" strokeWidth="2" />
                                    <rect x="13" y="5" width="14" height="6" rx="2" fill="#40c9ff" />
                                </svg>
                                <span className="ra-dorsal-text">{jugador.numero_camiseta}</span>
                            </div>
                            <div className="ra-player-info">
                                <span className="ra-player-name">{jugador.nombre} {jugador.apellidos}</span>
                                <span className={`ra-player-position px-3 py-1 rounded-full font-semibold text-xs flex items-center ${POSICION_COLORS[jugador.posicion] || "bg-neutral-700 text-white"}`}>
                                    {jugador.posicion}
                                </span>
                            </div>
                            <div className="ra-checkboxes">
                                <label className="ra-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={estado === "titular"}
                                        onChange={() => toggleTitular(jugador.id_jugador)}
                                    />
                                    Titular
                                </label>
                                <label className="ra-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={estado === "suplente"}
                                        onChange={() => toggleSuplente(jugador.id_jugador)}
                                    />
                                    Suplente
                                </label>
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