import { useEffect, useState } from "react";
import { equipoService } from "../../services/equipos.service";
import { partidosService } from "../../services/partidos.service";
import { Mensaje } from "../Error/Mensaje";
import cerrarModalIcon from "/src/assets/cerrar-modal.svg";
import spinnerIcon from "/src/assets/spinner.svg";
import alertaIcon from "/src/assets/icono-alerta.svg";

export default function RegistrarPartidoModal({ partido, onClose }) {
    const [formulario, setFormulario] = useState({
        goles_local: partido?.goles_local ?? 0,
        goles_visitante: partido?.goles_visitante ?? 0,
        estadisticas_individuales: []
    });
    const [jugadoresLocal, setJugadoresLocal] = useState([]);
    const [jugadoresVisitante, setJugadoresVisitante] = useState([]);
    const [error, setError] = useState("");
    const [exito, setExito] = useState("");
    const [cargando, setCargando] = useState(true);
    const [infoEquipoLocal, setInfoEquipoLocal] = useState(null);
    const [infoEquipoVisitante, setInfoEquipoVisitante] = useState(null);
    const [formularioValido, setFormularioValido] = useState(false);

    useEffect(() => {
        async function obtenerInfoEquipos() {
            try {
                const resLocal = await equipoService.getEquipoById(partido.equipo_local_id);
                if (resLocal.status === 200) setInfoEquipoLocal(resLocal.equipo);

                const resVisitante = await equipoService.getEquipoById(partido.equipo_visitante_id);
                if (resVisitante.status === 200) setInfoEquipoVisitante(resVisitante.equipo);
            } catch (error) {
                console.error("Error al obtener información de los equipos:", error);
            }
        }
        obtenerInfoEquipos();
    }, [partido]);

    useEffect(() => {
        const tieneMarcador = formulario.goles_local >= 0 && formulario.goles_visitante >= 0;
        const tieneMVP = formulario.estadisticas_individuales.some(est => est.mejor_jugador);
        setFormularioValido(tieneMarcador && tieneMVP);
    }, [formulario]);

    useEffect(() => {
        async function obtenerJugadores() {
            setCargando(true);
            try {
                if (!partido?.equipo_local_id || !partido?.equipo_visitante_id) {
                    throw new Error("Faltan los IDs de los equipos");
                }
                const resLocal = await equipoService.getJugadoresByEquipo(partido.equipo_local_id);
                if (resLocal.status !== 200) throw new Error(resLocal.message || "Error al obtener jugadores locales");
                const resVisitante = await equipoService.getJugadoresByEquipo(partido.equipo_visitante_id);
                if (resVisitante.status !== 200) throw new Error(resVisitante.message || "Error al obtener jugadores visitantes");

                setJugadoresLocal(resLocal.jugadores);
                setJugadoresVisitante(resVisitante.jugadores);

                const estadisticasIniciales = [
                    ...resLocal.jugadores.map(j => ({
                        id_jugador: j.id_jugador,
                        goles: 0,
                        tarjetas_amarillas: 0,
                        tarjetas_rojas: 0,
                        mejor_jugador: false
                    })),
                    ...resVisitante.jugadores.map(j => ({
                        id_jugador: j.id_jugador,
                        goles: 0,
                        tarjetas_amarillas: 0,
                        tarjetas_rojas: 0,
                        mejor_jugador: false
                    }))
                ];
                setFormulario(prev => ({
                    ...prev,
                    estadisticas_individuales: estadisticasIniciales
                }));
            } catch (error) {
                console.error("Error al cargar jugadores:", error);
                setError(error.message || "Error al cargar los jugadores");
            } finally {
                setCargando(false);
            }
        }
        obtenerJugadores();
    }, [partido]);

    function actualizarEstadistica(id_jugador, campo, valor) {
        setFormulario(prev => {
            const nuevasEstadisticas = prev.estadisticas_individuales.map(est =>
                est.id_jugador === id_jugador ? { ...est, [campo]: valor } : est
            );
            return { ...prev, estadisticas_individuales: nuevasEstadisticas };
        });
    }

    async function guardarEstadisticas(e) {
        e.preventDefault();
        setError("");
        setExito("");

        if (!formularioValido) {
            setError("Debes marcar un resultado y seleccionar al menos un MVP");
            return;
        }

        const golesLocalJugadores = calcularGolesJugadores(jugadoresLocal);
        const golesVisitanteJugadores = calcularGolesJugadores(jugadoresVisitante);

        if (golesLocalJugadores !== formulario.goles_local) {
            setError(`Los goles asignados a jugadores locales (${golesLocalJugadores}) deben ser igual a los goles del equipo (${formulario.goles_local})`);
            return;
        }

        if (golesVisitanteJugadores !== formulario.goles_visitante) {
            setError(`Los goles asignados a jugadores visitantes (${golesVisitanteJugadores}) deben ser igual a los goles del equipo (${formulario.goles_visitante})`);
            return;
        }

        try {
            const response = await partidosService.registrarEstadisticas(partido.id_partido, formulario);
            if (response.status === 200) {
                setExito("Estadísticas registradas correctamente");
                setTimeout(() => {
                    onClose();
                }, 2000);
            } else {
                setError(response.message || "Error al registrar las estadísticas");
            }
        } catch (error) {
            setError("Error al conectar con el servidor");
            console.error("Error:", error);
        }
    }

    function calcularGolesJugadores(jugadores) {
        return formulario.estadisticas_individuales
            .filter(est => jugadores.some(j => j.id_jugador === est.id_jugador))
            .reduce((sum, est) => sum + (est.goles || 0), 0);
    }

    function renderFilaJugador(jugador) {
        const estadistica = formulario.estadisticas_individuales.find(e => e.id_jugador === jugador.id_jugador) || {};
        return (
            <div key={jugador.id_jugador} className="grid grid-cols-12 gap-4 items-center py-3 px-4 mt-5 hover:bg-neutral-800/50 transition-colors rounded-lg">
                <div className="col-span-4">
                    <div className="flex items-center space-x-3">
                        <span className="text-xs px-2 py-1 bg-neutral-700/50 rounded-full text-neutral-300">
                            {jugador.dorsal}
                        </span>
                        <span className="text-sm font-medium text-white">
                            {jugador.nombre} {jugador.apellidos}
                        </span>
                    </div>
                </div>
                <div className="col-span-2">
                    <input
                        type="number"
                        min="0"
                        value={estadistica.goles || 0}
                        onChange={e => actualizarEstadistica(jugador.id_jugador, 'goles', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#40c9ff] transition-all"
                    />
                </div>
                <div className="col-span-2">
                    <input
                        type="number"
                        min="0"
                        max="2"
                        value={estadistica.tarjetas_amarillas || 0}
                        onChange={e => actualizarEstadistica(jugador.id_jugador, 'tarjetas_amarillas', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#40c9ff] transition-all"
                    />
                </div>
                <div className="col-span-2">
                    <input
                        type="number"
                        min="0"
                        max="1"
                        value={estadistica.tarjetas_rojas || 0}
                        onChange={e => actualizarEstadistica(jugador.id_jugador, 'tarjetas_rojas', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#40c9ff] transition-all"
                    />
                </div>
                <div className="col-span-2 flex justify-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={estadistica.mejor_jugador || false}
                            onChange={e => actualizarEstadistica(jugador.id_jugador, 'mejor_jugador', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#40c9ff]"></div>
                    </label>
                </div>
            </div>
        );
    }

    function limpiarMensajes() {
        setError("");
        setExito("");
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1c1c24] rounded-xl w-full max-w-4xl max-h-[75vh] flex flex-col overflow-hidden shadow-xl">
                <div className="flex justify-between items-center p-6 border-b border-neutral-800">
                    <h2 className="text-2xl font-bold text-white">
                        Registrar Estadísticas del Partido
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-white transition-colors"
                    >
                        <img
                            src={cerrarModalIcon}
                            alt="Cerrar"
                            className="w-6 h-6"
                        />
                    </button>
                </div>

                <div
                    role="alert"
                    className="flex items-center p-3 rounded-lg bg-neutral-800/30 text-yellow-500 border border-yellow-500 mb-4"
                >
                    <img
                        src={alertaIcon}
                        alt="Alerta"
                        className="w-5 h-5 mr-2 text-yellow-500"
                    />
                    <span className="text-sm italic text-yellow-500">
                        Asegúrate de seleccionar un MVP por equipo y registrar el resultado del partido.
                    </span>
                </div>

                <div className="overflow-y-auto flex-1 p-6">
                    <form onSubmit={guardarEstadisticas} className="space-y-6">
                        <div className="bg-neutral-900/50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-white mb-4">Marcador Final</h3>
                            <div className="flex items-center justify-center space-x-6">
                                <div className="flex items-center space-x-3">
                                    {infoEquipoLocal?.escudo && (
                                        <img
                                            src={infoEquipoLocal.escudo}
                                            alt={`Escudo ${infoEquipoLocal.nombre_equipo}`}
                                            className="w-12 h-12 object-contain"
                                        />
                                    )}
                                </div>
                                <div className="flex items-center space-x-4 bg-neutral-800/50 px-6 py-3 rounded-lg">
                                    <input
                                        type="number"
                                        min="0"
                                        value={formulario.goles_local}
                                        onChange={e => setFormulario({ ...formulario, goles_local: parseInt(e.target.value) || 0 })}
                                        className="w-16 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-center text-white text-lg font-bold focus:outline-none focus:ring-1 focus:ring-[#40c9ff]"
                                    />
                                    <span className="text-xl font-bold text-white">-</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formulario.goles_visitante}
                                        onChange={e => setFormulario({ ...formulario, goles_visitante: parseInt(e.target.value) || 0 })}
                                        className="w-16 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-center text-white text-lg font-bold focus:outline-none focus:ring-1 focus:ring-[#40c9ff]"
                                    />
                                </div>
                                <div className="flex items-center space-x-3">
                                    {infoEquipoVisitante?.escudo && (
                                        <img
                                            src={infoEquipoVisitante.escudo}
                                            alt={`Escudo ${infoEquipoVisitante.nombre_equipo}`}
                                            className="w-12 h-12 object-contain"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                        {cargando ? (
                            <div className="flex justify-center items-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#40c9ff]"></div>
                            </div>
                        ) : (
                            <>
                                <div className="bg-neutral-900/50 p-6 rounded-xl">
                                    <div className="flex items-center space-x-3 mb-4">
                                        {infoEquipoLocal?.escudo && (
                                            <img
                                                src={infoEquipoLocal.escudo}
                                                alt={`escudo`}
                                                className="w-8 h-8 object-contain"
                                            />
                                        )}
                                        <h3 className="text-lg font-semibold text-white">{infoEquipoLocal?.nombre_equipo || partido.equipo_local?.nombre_equipo}</h3>
                                    </div>
                                    <div className="grid grid-cols-12 gap-4 pb-3 px-4 text-sm text-neutral-400 font-medium">
                                        <div className="col-span-4">Jugador</div>
                                        <div className="col-span-2">Goles</div>
                                        <div className="col-span-2">Amarillas</div>
                                        <div className="col-span-2">Rojas</div>
                                        <div className="col-span-2 text-center">MVP</div>
                                    </div>
                                    <div className="space-y-2">
                                        {jugadoresLocal.map(jugador => renderFilaJugador(jugador))}
                                    </div>
                                </div>
                                <div className="bg-neutral-900/50 p-6 rounded-xl">
                                    <div className="flex items-center space-x-3 mb-4">
                                        {infoEquipoVisitante?.escudo && (
                                            <img
                                                src={infoEquipoVisitante.escudo}
                                                alt={`escudo`}
                                                className="w-8 h-8 object-contain"
                                            />
                                        )}
                                        <h3 className="text-lg font-semibold text-white">{infoEquipoVisitante?.nombre_equipo || partido.equipo_visitante?.nombre_equipo}</h3>
                                    </div>
                                    <div className="grid grid-cols-12 gap-4 pb-3 px-4 text-sm text-neutral-400 font-medium">
                                        <div className="col-span-4">Jugador</div>
                                        <div className="col-span-2">Goles</div>
                                        <div className="col-span-2">Amarillas</div>
                                        <div className="col-span-2">Rojas</div>
                                        <div className="col-span-2 text-center">MVP</div>
                                    </div>
                                    <div className="space-y-2">
                                        {jugadoresVisitante.map(jugador => renderFilaJugador(jugador))}
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </div>
                <div className="p-4 border-t border-neutral-800 bg-[#1c1c24]">
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-neutral-400 hover:text-white transition-colors rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            onClick={guardarEstadisticas}
                            disabled={!formularioValido || cargando}
                            className={`px-5 py-2.5 bg-gradient-to-r from-[#e81cff] to-[#40c9ff] text-white rounded-lg transition-all cursor-pointer ${!formularioValido || cargando ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                        >
                            {cargando ? (
                                <span className="flex items-center justify-center">
                                    <img
                                        src={spinnerIcon}
                                        alt="Cargando"
                                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                                    />
                                    Guardando...
                                </span>
                            ) : 'Guardar Estadísticas'}
                        </button>
                    </div>
                </div>
                <Mensaje error={error} success={exito} onClose={limpiarMensajes} />
            </div>
        </div>
    );
}