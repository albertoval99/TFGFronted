import { useEffect, useState } from "react";
import { estadisticasService } from "../../services/estadisticas.service";


export default function ModalEstadisticasJugador({ idJugador, onClose }) {
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            const response = await estadisticasService.getEstadisticasJugador(idJugador);
            if (response.status === 200) setEstadisticas(response.data);
            setLoading(false);
        }
        fetchStats();
    }, [idJugador]);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1c1c24] rounded-lg p-6 w-full max-w-md">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        Estadísticas del Jugador
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Contenido */}
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#40c9ff]"></div>
                    </div>
                ) : estadisticas ? (
                    <div className="space-y-6">
                            {/* Info del jugador */}
                            <div className="flex items-center space-x-4 bg-black/30 p-4 rounded-lg">
                                <span className="relative w-12 h-12 flex items-center justify-center">
                                    <svg className="w-12 h-12" viewBox="0 0 40 40" fill="none">
                                        <path d="M10 5 L30 5 L35 15 L32 35 L8 35 L5 15 Z" fill="#232531" stroke="#40c9ff" strokeWidth="2" />
                                        <rect x="13" y="5" width="14" height="6" rx="2" fill="#40c9ff" />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg select-none">
                                        {estadisticas.dorsal}
                                    </span>
                                </span>
                                <div>
                                    <h3 className="text-white font-semibold">{estadisticas.nombre} {estadisticas.apellidos}</h3>
                                </div>
                            </div>

                        {/* Grid de estadísticas */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-600/10 border border-green-600/20 rounded-lg p-4 text-center">
                                <span className="block text-2xl font-bold text-green-400">{estadisticas.goles}</span>
                                <span className="text-neutral-400">Goles</span>
                            </div>
                            <div className="bg-yellow-600/10 border border-yellow-600/20 rounded-lg p-4 text-center">
                                <span className="block text-2xl font-bold text-yellow-400">{estadisticas.tarjetas_amarillas}</span>
                                <span className="text-neutral-400">Amarillas</span>
                            </div>
                            <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4 text-center">
                                <span className="block text-2xl font-bold text-red-400">{estadisticas.tarjetas_rojas}</span>
                                <span className="text-neutral-400">Rojas</span>
                            </div>
                            <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4 text-center">
                                <span className="block text-2xl font-bold text-blue-400">{estadisticas.mejor_jugador}</span>
                                <span className="text-neutral-400">MVP</span>
                            </div>
                            <div className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-4 text-center col-span-2">
                                <span className="block text-2xl font-bold text-purple-400">{estadisticas.titularidades}</span>
                                <span className="text-neutral-400">Titularidades</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg text-center">
                        No se encontraron estadísticas
                    </div>
                )}
            </div>
        </div>
    );
}