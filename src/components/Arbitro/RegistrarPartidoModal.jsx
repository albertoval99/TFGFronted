import { useEffect, useState } from "react";
import { equipoService } from "../../services/equipos.service";
import { partidosService } from "../../services/partidos.service";

export default function RegistrarPartidoModal({ partido, onClose, onSave }) {
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

    useEffect(() => {
        async function fetchJugadores() {
            setLoading(true);
            try {
                // Verificar que tenemos los IDs necesarios
                if (!partido?.equipo_local_id || !partido?.equipo_visitante_id) {
                    throw new Error("Faltan los IDs de los equipos");
                }

                // Obtener jugadores del equipo local
                const resLocal = await equipoService.getJugadoresByEquipo(partido.equipo_local_id);
                if (resLocal.status !== 200) {
                    throw new Error(resLocal.message || "Error al obtener jugadores locales");
                }

                // Obtener jugadores del equipo visitante
                const resVisitante = await equipoService.getJugadoresByEquipo(partido.equipo_visitante_id);
                if (resVisitante.status !== 200) {
                    throw new Error(resVisitante.message || "Error al obtener jugadores visitantes");
                }

                setJugadoresLocal(resLocal.jugadores);
                setJugadoresVisitante(resVisitante.jugadores);

                // Inicializar estadísticas individuales
                const iniciales = [
                    ...resLocal.jugadores.map(j => ({
                        id_jugador: j.id_jugador,
                        goles: 0,
                        tarjetas_amarillas: 0,
                        tarjetas_rojas: 0,
                        mejor_jugador: false,
                        titularidades: 90
                    })),
                    ...resVisitante.jugadores.map(j => ({
                        id_jugador: j.id_jugador,
                        goles: 0,
                        tarjetas_amarillas: 0,
                        tarjetas_rojas: 0,
                        mejor_jugador: false,
                        titularidades: 90
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

        // Validación básica
        if (formData.goles_local < 0 || formData.goles_visitante < 0) {
            setError("Los goles no pueden ser negativos");
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
    const renderJugadorRow = (jugador, esLocal) => {
        const estadistica = formData.estadisticas_individuales.find(e => e.id_jugador === jugador.id_jugador) || {};

        return (
            <div key={jugador.id_jugador} className="grid grid-cols-12 gap-2 items-center py-2 border-b border-neutral-800">
                <div className="col-span-4 text-sm">
                    {jugador.nombre} {jugador.apellidos}
                    <span className="text-xs text-neutral-400 block">{jugador.posicion}</span>
                </div>

                <div className="col-span-2">
                    <input
                        type="number"
                        min="0"
                        value={estadistica.goles || 0}
                        onChange={(e) => handleChangeEstadistica(jugador.id_jugador, 'goles', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-neutral-900/50 border border-neutral-800 rounded text-white text-xs"
                    />
                </div>

                <div className="col-span-2">
                    <input
                        type="number"
                        min="0"
                        max="2"
                        value={estadistica.tarjetas_amarillas || 0}
                        onChange={(e) => handleChangeEstadistica(jugador.id_jugador, 'tarjetas_amarillas', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-neutral-900/50 border border-neutral-800 rounded text-white text-xs"
                    />
                </div>

                <div className="col-span-2">
                    <input
                        type="number"
                        min="0"
                        max="1"
                        value={estadistica.tarjetas_rojas || 0}
                        onChange={(e) => handleChangeEstadistica(jugador.id_jugador, 'tarjetas_rojas', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 bg-neutral-900/50 border border-neutral-800 rounded text-white text-xs"
                    />
                </div>

                <div className="col-span-2 flex justify-center">
                    <input
                        type="checkbox"
                        checked={estadistica.mejor_jugador || false}
                        onChange={(e) => handleChangeEstadistica(jugador.id_jugador, 'mejor_jugador', e.target.checked)}
                        className="h-4 w-4 rounded border-neutral-800 bg-neutral-900/50 text-[#40c9ff] focus:ring-[#40c9ff]"
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto py-10">
            <div className="bg-[#1c1c24] rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        Registrar Estadísticas - {partido.equipo_local?.nombre} vs {partido.equipo_visitante?.nombre}
                    </h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 text-white">
                    {/* Marcador */}
                    <div className="bg-neutral-900/50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium mb-4">Marcador Final</h3>
                        <div className="flex items-center justify-center space-x-4">
                            <div className="flex-1 text-right">
                                <span className="font-medium">{partido.equipo_local?.nombre}</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.goles_local}
                                    onChange={(e) => setFormData({ ...formData, goles_local: parseInt(e.target.value) || 0 })}
                                    className="w-16 ml-2 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-center text-white"
                                />
                            </div>

                            <span className="text-xl">-</span>

                            <div className="flex-1 text-left">
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.goles_visitante}
                                    onChange={(e) => setFormData({ ...formData, goles_visitante: parseInt(e.target.value) || 0 })}
                                    className="w-16 mr-2 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-center text-white"
                                />
                                <span className="font-medium">{partido.equipo_visitante?.nombre}</span>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas por jugador */}
                    {loading ? (
                        <div className="text-center py-10">Cargando jugadores...</div>
                    ) : (
                        <>
                            {/* Equipo Local */}
                            <div className="bg-neutral-900/50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium mb-4">{partido.equipo_local?.nombre}</h3>

                                <div className="grid grid-cols-12 gap-2 pb-2 border-b border-neutral-800 text-xs text-neutral-400">
                                    <div className="col-span-4">Jugador</div>
                                    <div className="col-span-2">Goles</div>
                                    <div className="col-span-2">Amarillas</div>
                                    <div className="col-span-2">Rojas</div>
                                    <div className="col-span-2 text-center">MVP</div>
                                </div>

                                {jugadoresLocal.map(jugador => renderJugadorRow(jugador, true))}
                            </div>

                            {/* Equipo Visitante */}
                            <div className="bg-neutral-900/50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium mb-4">{partido.equipo_visitante?.nombre}</h3>

                                <div className="grid grid-cols-12 gap-2 pb-2 border-b border-neutral-800 text-xs text-neutral-400">
                                    <div className="col-span-4">Jugador</div>
                                    <div className="col-span-2">Goles</div>
                                    <div className="col-span-2">Amarillas</div>
                                    <div className="col-span-2">Rojas</div>
                                    <div className="col-span-2 text-center">MVP</div>
                                </div>

                                {jugadoresVisitante.map(jugador => renderJugadorRow(jugador, false))}
                            </div>
                        </>
                    )}

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-500/10 border border-green-500 text-green-500 p-3 rounded text-sm">
                            {success}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-gradient-to-r from-[#e81cff] to-[#40c9ff] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : 'Guardar Estadísticas'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}