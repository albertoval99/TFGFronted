import { useEffect, useState } from "react";
import { equipoService } from "../../services/equipos.service";
import { partidosService } from "../../services/partidos.service";

export default function RegistrarPartidoModal({ partido, onClose }) {
    const [formData, setFormData] = useState({
        goles_local: partido?.goles_local ?? 0,
        goles_visitante: partido?.goles_visitante ?? 0,
        estadisticas_individuales: []
    });

    const [jugadoresLocal, setJugadoresLocal] = useState([]);
    const [jugadoresVisitante, setJugadoresVisitante] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [equipoLocalInfo, setEquipoLocalInfo] = useState(null);
    const [equipoVisitanteInfo, setEquipoVisitanteInfo] = useState(null);
    const [formValid, setFormValid] = useState(false);

    useEffect(() => {
        async function fetchEquipoInfo() {
            try {
                const resLocal = await equipoService.getEquipoById(partido.equipo_local_id);
                if (resLocal.status === 200) {
                    setEquipoLocalInfo(resLocal.equipo);
                }

                const resVisitante = await equipoService.getEquipoById(partido.equipo_visitante_id);
                if (resVisitante.status === 200) {
                    setEquipoVisitanteInfo(resVisitante.equipo);
                }
            } catch (error) {
                console.error("Error al obtener información de los equipos:", error);
            }
        }

        fetchEquipoInfo();
    }, [partido]);

    useEffect(() => {
        // Validar que hay goles marcados y al menos un MVP seleccionado
        const hasScore = formData.goles_local >= 0 && formData.goles_visitante >= 0;
        const hasMVP = formData.estadisticas_individuales.some(est => est.mejor_jugador);

        setFormValid(hasScore && hasMVP);
    }, [formData]);

    useEffect(() => {
        async function fetchJugadores() {
            setLoading(true);
            try {
                if (!partido?.equipo_local_id || !partido?.equipo_visitante_id) {
                    throw new Error("Faltan los IDs de los equipos");
                }

                const resLocal = await equipoService.getJugadoresByEquipo(partido.equipo_local_id);
                if (resLocal.status !== 200) {
                    throw new Error(resLocal.message || "Error al obtener jugadores locales");
                }

                const resVisitante = await equipoService.getJugadoresByEquipo(partido.equipo_visitante_id);
                if (resVisitante.status !== 200) {
                    throw new Error(resVisitante.message || "Error al obtener jugadores visitantes");
                }

                setJugadoresLocal(resLocal.jugadores);
                setJugadoresVisitante(resVisitante.jugadores);

                const iniciales = [
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

                setFormData(prev => ({
                    ...prev,
                    estadisticas_individuales: iniciales
                }));

            } catch (error) {
                console.error("Error al cargar jugadores:", error);
                setError(error.message || "Error al cargar los jugadores");
            } finally {
                setLoading(false);
            }
        }

        fetchJugadores();
    }, [partido]);

    const handleChangeEstadistica = (id_jugador, field, value) => {
        if (field === 'goles') {
            // Determinar si el jugador es local o visitante
            const esLocal = jugadoresLocal.some(j => j.id_jugador === id_jugador);
            const golesEquipo = esLocal ? formData.goles_local : formData.goles_visitante;

            // Sumar goles actuales de jugadores del mismo equipo
            const jugadoresEquipo = esLocal ? jugadoresLocal : jugadoresVisitante;
            const golesActualesJugadores = formData.estadisticas_individuales
                .filter(est => jugadoresEquipo.some(j => j.id_jugador === est.id_jugador))
                .reduce((sum, est) => sum + (est.goles || 0), 0);

            // Goles actuales de este jugador
            const golesActualesEsteJugador = formData.estadisticas_individuales.find(est => est.id_jugador === id_jugador)?.goles || 0;

            // Nuevos goles totales si se cambia este valor
            const nuevosGolesTotales = golesActualesJugadores - golesActualesEsteJugador + (parseInt(value) || 0);

            if (nuevosGolesTotales > golesEquipo) {
                setError(`No puedes asignar más goles que los marcados por el equipo`);
                return;
            } else {
                setError(""); // Limpiar error si está bien
            }
        }

        setFormData(prev => {
            const nuevasEstadisticas = prev.estadisticas_individuales.map(est => {
                if (est.id_jugador === id_jugador) {
                    return { ...est, [field]: value };
                }
                return est;
            });

            return {
                ...prev,
                estadisticas_individuales: nuevasEstadisticas
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!formValid) {
            setError("Debes marcar un resultado y seleccionar al menos un MVP");
            return;
        }

        // Validar suma de goles por equipo
        const golesJugadoresLocal = formData.estadisticas_individuales
            .filter(est => jugadoresLocal.some(j => j.id_jugador === est.id_jugador))
            .reduce((sum, est) => sum + (est.goles || 0), 0);

        const golesJugadoresVisitante = formData.estadisticas_individuales
            .filter(est => jugadoresVisitante.some(j => j.id_jugador === est.id_jugador))
            .reduce((sum, est) => sum + (est.goles || 0), 0);

        if (golesJugadoresLocal > formData.goles_local) {
            setError(`Los goles asignados a jugadores locales (${golesJugadoresLocal}) superan los goles del equipo (${formData.goles_local})`);
            return;
        }

        if (golesJugadoresVisitante > formData.goles_visitante) {
            setError(`Los goles asignados a jugadores visitantes (${golesJugadoresVisitante}) superan los goles del equipo (${formData.goles_visitante})`);
            return;
        }

        try {
            const response = await partidosService.registrarEstadisticas(
                partido.id_partido,
                formData
            );

            if (response.status === 200) {
                setSuccess("Estadísticas registradas correctamente");
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
    };

    const renderJugadorRow = (jugador) => {
        const estadistica = formData.estadisticas_individuales.find(e => e.id_jugador === jugador.id_jugador) || {};

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
                        onChange={(e) => handleChangeEstadistica(jugador.id_jugador, 'goles', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#40c9ff] transition-all"
                    />
                </div>

                <div className="col-span-2">
                    <input
                        type="number"
                        min="0"
                        max="2"
                        value={estadistica.tarjetas_amarillas || 0}
                        onChange={(e) => handleChangeEstadistica(jugador.id_jugador, 'tarjetas_amarillas', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#40c9ff] transition-all"
                    />
                </div>

                <div className="col-span-2">
                    <input
                        type="number"
                        min="0"
                        max="1"
                        value={estadistica.tarjetas_rojas || 0}
                        onChange={(e) => handleChangeEstadistica(jugador.id_jugador, 'tarjetas_rojas', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#40c9ff] transition-all"
                    />
                </div>

                <div className="col-span-2 flex justify-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={estadistica.mejor_jugador || false}
                            onChange={(e) => handleChangeEstadistica(jugador.id_jugador, 'mejor_jugador', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#40c9ff]"></div>
                    </label>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1c1c24] rounded-xl w-full max-w-4xl max-h-[75vh] flex flex-col overflow-hidden shadow-xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-neutral-800">
                    <h2 className="text-2xl font-bold text-white">
                        Registrar Estadísticas del Partido
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div
                    role="alert"
                    className="flex items-center p-3 rounded-lg bg-neutral-800/30 text-yellow-500 border border-yellow-500 mb-4"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5 mr-2 text-yellow-500"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                        />
                    </svg>
                    <span className="text-sm italic text-yellow-500">
                        Asegúrate de seleccionar un MVP por equipo y registrar el resultado del partido.
                    </span>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto flex-1 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Marcador con escudos */}
                        <div className="bg-neutral-900/50 p-6 rounded-xl">
                            <h3 className="text-lg font-semibold text-white mb-4">Marcador Final</h3>

                            <div className="flex items-center justify-center space-x-6">
                                {/* Equipo Local */}
                                <div className="flex items-center space-x-3">
                                    {equipoLocalInfo?.escudo && (
                                        <img
                                            src={equipoLocalInfo.escudo}
                                            alt={`Escudo ${equipoLocalInfo.nombre_equipo}`}
                                            className="w-12 h-12 object-contain"
                                        />
                                    )}
                                </div>

                                {/* Inputs de goles */}
                                <div className="flex items-center space-x-4 bg-neutral-800/50 px-6 py-3 rounded-lg">
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.goles_local}
                                        onChange={(e) => setFormData({ ...formData, goles_local: parseInt(e.target.value) || 0 })}
                                        className="w-16 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-center text-white text-lg font-bold focus:outline-none focus:ring-1 focus:ring-[#40c9ff]"
                                    />
                                    <span className="text-xl font-bold text-white">-</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.goles_visitante}
                                        onChange={(e) => setFormData({ ...formData, goles_visitante: parseInt(e.target.value) || 0 })}
                                        className="w-16 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-center text-white text-lg font-bold focus:outline-none focus:ring-1 focus:ring-[#40c9ff]"
                                    />
                                </div>

                                {/* Equipo Visitante */}
                                <div className="flex items-center space-x-3">
                                    {equipoVisitanteInfo?.escudo && (
                                        <img
                                            src={equipoVisitanteInfo.escudo}
                                            alt={`Escudo ${equipoVisitanteInfo.nombre_equipo}`}
                                            className="w-12 h-12 object-contain"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Estadísticas por jugador */}
                        {loading ? (
                            <div className="flex justify-center items-center py-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#40c9ff]"></div>
                            </div>
                        ) : (
                            <>
                                {/* Equipo Local */}
                                <div className="bg-neutral-900/50 p-6 rounded-xl">
                                    <div className="flex items-center space-x-3 mb-4">
                                        {equipoLocalInfo?.escudo && (
                                            <img
                                                src={equipoLocalInfo.escudo}
                                                alt={`escudo`}
                                                className="w-8 h-8 object-contain"
                                            />
                                        )}
                                        <h3 className="text-lg font-semibold text-white">{equipoLocalInfo?.nombre_equipo || partido.equipo_local?.nombre_equipo}</h3>
                                    </div>

                                    <div className="grid grid-cols-12 gap-4 pb-3 px-4 text-sm text-neutral-400 font-medium">
                                        <div className="col-span-4">Jugador</div>
                                        <div className="col-span-2">Goles</div>
                                        <div className="col-span-2">Amarillas</div>
                                        <div className="col-span-2">Rojas</div>
                                        <div className="col-span-2 text-center">MVP</div>
                                    </div>

                                    <div className="space-y-2">
                                        {jugadoresLocal.map(jugador => renderJugadorRow(jugador, true))}
                                    </div>
                                </div>

                                {/* Equipo Visitante */}
                                <div className="bg-neutral-900/50 p-6 rounded-xl">
                                    <div className="flex items-center space-x-3 mb-4">
                                        {equipoVisitanteInfo?.escudo && (
                                            <img
                                                src={equipoVisitanteInfo.escudo}
                                                alt={`escudo`}
                                                className="w-8 h-8 object-contain"
                                            />
                                        )}
                                        <h3 className="text-lg font-semibold text-white">{equipoVisitanteInfo?.nombre_equipo || partido.equipo_visitante?.nombre_equipo}</h3>
                                    </div>

                                    <div className="grid grid-cols-12 gap-4 pb-3 px-4 text-sm text-neutral-400 font-medium">
                                        <div className="col-span-4">Jugador</div>
                                        <div className="col-span-2">Goles</div>
                                        <div className="col-span-2">Amarillas</div>
                                        <div className="col-span-2">Rojas</div>
                                        <div className="col-span-2 text-center">MVP</div>
                                    </div>

                                    <div className="space-y-2">
                                        {jugadoresVisitante.map(jugador => renderJugadorRow(jugador, false))}
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </div>

                {/* Footer con botones */}
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
                            onClick={handleSubmit}
                            disabled={!formValid || loading}
                            className={`px-5 py-2.5 bg-gradient-to-r from-[#e81cff] to-[#40c9ff] text-white rounded-lg transition-all cursor-pointer ${!formValid || loading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </span>
                            ) : 'Guardar Estadísticas'}
                        </button>
                    </div>
                </div>
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
            </div>
        </div>
    );
}