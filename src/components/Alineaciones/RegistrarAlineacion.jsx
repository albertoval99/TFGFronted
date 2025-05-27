import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { alineacionesService } from "../../services/alineaciones.service";
import { userService } from "../../services/usuarios.service";
import "./Alineacion.css";
import { Mensaje } from "../Error/Mensaje";
import camisetaJugadorIcon from "/src/assets/camiseta-jugador.svg";

export default function RegistrarAlineacion() {
    const { id_partido } = useParams();
    const navigate = useNavigate();

    const [listaJugadores, setListaJugadores] = useState([]);
    const [estadoJugadores, setEstadoJugadores] = useState({});
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");

    const COLORES_POSICION = {
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
        async function cargarDatosIniciales() {
            if (!id_partido) {
                setError("No se encontró el partido");
                setCargando(false);
                return;
            }
            try {
                const respuestaJugadores = await userService.getJugadoresByEquipo();
                if (respuestaJugadores.status !== 200) {
                    setError("Error al cargar jugadores");
                    setCargando(false);
                    return;
                }
                const datosJugadores = respuestaJugadores.jugadores;
                const estadoInicialJugadores = {};

                datosJugadores.forEach((jugador) => {
                    estadoInicialJugadores[jugador.id_jugador] = "no";
                });

                try {
                    const respuestaAlineacion = await alineacionesService.getAlineacionesByPartido(id_partido);
                    if (Array.isArray(respuestaAlineacion)) {
                        respuestaAlineacion.forEach((alineacion) => {
                            estadoInicialJugadores[alineacion.id_jugador] = alineacion.es_titular ? "titular" : "suplente";
                        });
                    }
                } catch (error) {
                    console.error("No hay alineación previa", error)
                }

                setListaJugadores(datosJugadores);
                setEstadoJugadores(estadoInicialJugadores);
                setError(null);
            } catch (error) {
                setError("Error inesperado al cargar datos");
                console.error(error);
            } finally {
                setCargando(false);
            }
        }
        cargarDatosIniciales();
    }, [id_partido]);

    function cambiarEstadoTitular(idJugador) {
        setEstadoJugadores((estadoAnterior) => {
            const estadoActual = estadoAnterior[idJugador];
            const cantidadTitulares = Object.values(estadoAnterior).filter((estado) => estado === "titular").length;

            if (estadoActual === "titular") {
                setError(null);
                return { ...estadoAnterior, [idJugador]: "no" };
            }

            if (cantidadTitulares >= 11) {
                setError("No puedes tener más de 11 titulares");
                return estadoAnterior;
            }

            setError(null);
            return { ...estadoAnterior, [idJugador]: "titular" };
        });
    }

    function cambiarEstadoSuplente(idJugador) {
        setEstadoJugadores((estadoAnterior) => {
            const estadoActual = estadoAnterior[idJugador];
            const cantidadSuplentes = Object.values(estadoAnterior).filter((estado) => estado === "suplente").length;

            if (estadoActual === "suplente") {
                setError(null);
                return { ...estadoAnterior, [idJugador]: "no" };
            }

            if (cantidadSuplentes >= 7) {
                setError("No puedes tener más de 7 suplentes");
                return estadoAnterior;
            }

            setError(null);
            return { ...estadoAnterior, [idJugador]: "suplente" };
        });
    }

    async function guardarAlineacionCompleta() {
        setError(null);
        setError("");
        try {
            const datosUsuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
            const idEquipo = datosUsuario.equipo?.id_equipo;

            if (!idEquipo) {
                setError("No se encontró el equipo del usuario");
                return;
            }

            const jugadoresTitulares = Object.entries(estadoJugadores)
                .filter(([, estado]) => estado === "titular")
                .map(([idJugador]) => Number(idJugador));

            const jugadoresSuplentes = Object.entries(estadoJugadores)
                .filter(([, estado]) => estado === "suplente")
                .map(([idJugador]) => Number(idJugador));

            if (jugadoresTitulares.length !== 11) {
                setError("Tienes que tener 11 titulares exactamente");
                return;
            }
            if (jugadoresSuplentes.length > 7) {
                setError("No puedes tener más de 7 suplentes");
                return;
            }

            const datosAlineaciones = [
                ...jugadoresTitulares.map((idJugador) => ({
                    id_partido,
                    id_jugador: idJugador,
                    id_equipo: idEquipo,
                    es_titular: true,
                })),
                ...jugadoresSuplentes.map((idJugador) => ({
                    id_partido,
                    id_jugador: idJugador,
                    id_equipo: idEquipo,
                    es_titular: false,
                })),
            ];

            await Promise.all(
                datosAlineaciones.map((datosAlineacion) =>
                    alineacionesService.registrarAlineacion(datosAlineacion)
                )
            );
            setSuccess("Alineación guardada correctamente");
            setTimeout(() => { navigate("/gestionarPartidos") }, 3000);
        } catch (error) {
            setError(error.message || "Error al guardar la alineación");
            console.error(error);
        }
    }

    if (cargando) return (
        <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#40c9ff]"></div>
        </div>
    );

    const cantidadTitulares = Object.values(estadoJugadores).filter((estado) => estado === "titular").length;
    const cantidadSuplentes = Object.values(estadoJugadores).filter((estado) => estado === "suplente").length;

    return (
        <div className="ra-container">
            <Mensaje
                error={error}
                success={success}
                onClose={() => { setError(""); setSuccess(""); }}
            />

            <h1 className="ra-title">Crear Alineación</h1>

            <div className="ra-counters">
                <div>Titulares: {cantidadTitulares} / 11</div>
                <div>Suplentes: {cantidadSuplentes} / 7</div>
            </div>

            <div className="ra-list">
                {listaJugadores.map((jugador) => {
                    const estadoActual = estadoJugadores[jugador.id_jugador];
                    return (
                        <div key={jugador.id_jugador} className="ra-player-card">
                            <div className="ra-dorsal-container" aria-hidden="true">
                                <img
                                    src={camisetaJugadorIcon}
                                    alt="Camiseta"
                                    className="ra-dorsal-svg"
                                    width={40}
                                    height={40}
                                />
                                <span className="ra-dorsal-text">{jugador.numero_camiseta}</span>
                            </div>
                            <div className="ra-player-info">
                                <span className="ra-player-name">{jugador.nombre} {jugador.apellidos}</span>
                                <span className={`ra-player-position px-3 py-1 rounded-full font-semibold text-xs flex items-center ${COLORES_POSICION[jugador.posicion] || "bg-neutral-700 text-white"}`}>
                                    {jugador.posicion}
                                </span>
                            </div>
                            <div className="ra-checkboxes">
                                <label className="ra-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={estadoActual === "titular"}
                                        onChange={() => cambiarEstadoTitular(jugador.id_jugador)}
                                    />
                                    Titular
                                </label>
                                <label className="ra-checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={estadoActual === "suplente"}
                                        onChange={() => cambiarEstadoSuplente(jugador.id_jugador)}
                                    />
                                    Suplente
                                </label>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button className="ra-save-btn" onClick={guardarAlineacionCompleta}>
                Guardar Alineación
            </button>
        </div>
    );
}