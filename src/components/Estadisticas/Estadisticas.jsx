import { useState, useEffect } from "react";
import maximoGoleador from "/src/assets/maximoGoleador.png";
import mejorJugador from "/src/assets/mejorJugador.png";
import masAmarillas from "/src/assets/masAmarillas.png";
import masRojas from "/src/assets/masRojas.png";
import masTitularidades from "/src/assets/masTitularidades.png";
import { estadisticasService } from "../../services/estadisticas.service";

const medallas = ["🥇", "🥈", "🥉"];

const CATEGORIAS = [
    {
        key: "goleadores",
        titulo: "Máximo Goleador",
        icono: maximoGoleador,
        fetchPrimero: estadisticasService.getMaximoGoleador,
        fetchRanking: estadisticasService.getMaximosGoleadores,
        statKey: "goles",
        color: "from-[#40c9ff] to-[#e81cff]",
        bgColor: "bg-gradient-to-br from-[#40c9ff]/10 to-[#e81cff]/10",
        borderColor: "border-[#40c9ff]",
    },
    {
        key: "mvp",
        titulo: "Mejor Jugador (MVP)",
        icono: mejorJugador,
        fetchPrimero: estadisticasService.getMejorJugador,
        fetchRanking: estadisticasService.getMejoresJugadores,
        statKey: "mejor_jugador",
        color: "from-yellow-400 to-yellow-600",
        bgColor: "bg-gradient-to-br from-yellow-400/10 to-yellow-600/10",
        borderColor: "border-yellow-500",
    },
    {
        key: "amarillas",
        titulo: "Más Amarillas",
        icono: masAmarillas,
        fetchPrimero: estadisticasService.getJugadorMasAmarillas,
        fetchRanking: estadisticasService.getJugadoresMasAmarillas,
        statKey: "tarjetas_amarillas",
        color: "from-yellow-300 to-yellow-500",
        bgColor: "bg-gradient-to-br from-yellow-300/10 to-yellow-500/10",
        borderColor: "border-yellow-400",
    },
    {
        key: "rojas",
        titulo: "Más Rojas",
        icono: masRojas,
        fetchPrimero: estadisticasService.getJugadorMasRojas,
        fetchRanking: estadisticasService.getJugadoresMasRojas,
        statKey: "tarjetas_rojas",
        color: "from-red-400 to-red-700",
        bgColor: "bg-gradient-to-br from-red-400/10 to-red-700/10",
        borderColor: "border-red-500",
    },
    {
        key: "titularidades",
        titulo: "Más Titularidades",
        icono: masTitularidades,
        fetchPrimero: estadisticasService.getJugadorMasTitularidades,
        fetchRanking: estadisticasService.getJugadoresMasTitularidades,
        statKey: "titularidades",
        color: "from-blue-400 to-blue-700",
        bgColor: "bg-gradient-to-br from-blue-400/10 to-blue-700/10",
        borderColor: "border-blue-500",
    },
];

export default function EstadisticasIndividuales() {
    const [primeros, setPrimeros] = useState({});
    const [modalAbierto, setModalAbierto] = useState(null);
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingRanking, setLoadingRanking] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");

        const cargarPrimeros = async () => {
            try {
                const primerosData = {};
                for (const categoria of CATEGORIAS) {
                    const response = await categoria.fetchPrimero();
                    primerosData[categoria.key] = response.data;
                }
                setPrimeros(primerosData);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setError("Error al cargar las estadísticas");
                setLoading(false);
            }
        };

        cargarPrimeros();
    }, []);

    const abrirModal = async (categoriaKey) => {
        setModalAbierto(categoriaKey);
        setLoadingRanking(true);

        try {
            const categoria = CATEGORIAS.find((c) => c.key === categoriaKey);
            const response = await categoria.fetchRanking();
            setRanking(response.data?.slice(0, 5) || []);
        } catch (error) {
            console.error("Error al cargar el ranking", error);
            setRanking([]);
        } finally {
            setLoadingRanking(false);
        }
    };

    const cerrarModal = () => {
        setModalAbierto(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#40c9ff]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-6 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-4 pt-25 flex flex-col items-center">
            <div className="w-full max-w-4xl">
                <div className="bg-gradient-to-br from-neutral-900 to-black rounded-3xl shadow-2xl p-8 border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center justify-center mb-8">
                        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4"></div>
                        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                            Figuras Destacadas
                        </h2>
                        <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full ml-4"></div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {CATEGORIAS.map((categoria) => (
                            <div
                                key={categoria.key}
                                className={`rounded-2xl overflow-hidden shadow-xl cursor-pointer hover:scale-[1.02] transition-all ${categoria.bgColor} border border-white/5 hover:border-white/20`}
                                onClick={() => abrirModal(categoria.key)}
                            >
                                <div className="flex items-center p-3">
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={categoria.icono}
                                            alt={categoria.titulo}
                                            className="w-24 h-24 object-contain drop-shadow-lg"
                                        />
                                    </div>

                                    <div className="flex-1 ml-4">
                                        <h3 className="text-lg font-medium text-white/80">
                                            {categoria.titulo}
                                        </h3>
                                        {primeros[categoria.key] ? (
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xl font-bold text-white">
                                                        {primeros[categoria.key].nombre} {primeros[categoria.key].apellidos}
                                                    </p>
                                                    <p className="text-white/60 text-sm">
                                                        ({primeros[categoria.key].nombre_equipo})
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-white/70">No hay datos</p>
                                        )}
                                    </div>

                                    {primeros[categoria.key] && (
                                        <div className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${categoria.color} flex items-center justify-center shadow-lg mr-2`}>
                                            <span className="text-2xl font-extrabold text-white">
                                                {primeros[categoria.key][categoria.statKey]}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-white/60 text-sm">
                            Haz clic en cualquier categoría para ver el ranking completo
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalAbierto && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="bg-neutral-900 rounded-3xl shadow-lg p-8 max-w-2xl w-full mx-4 border border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center">
                                <img
                                    src={CATEGORIAS.find(c => c.key === modalAbierto).icono}
                                    alt="Icono"
                                    className="w-8 h-8 mr-3"
                                />
                                <h2 className="text-2xl font-bold text-white">
                                    Ranking {CATEGORIAS.find((c) => c.key === modalAbierto).titulo}
                                </h2>
                            </div>
                            <button
                                onClick={cerrarModal}
                                className="text-neutral-500 hover:text-white transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {loadingRanking ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#40c9ff]"></div>
                            </div>
                        ) : ranking.length > 0 ? (
                            <div className="space-y-2">
                                {ranking.map((jugador, idx) => {
                                    const categoria = CATEGORIAS.find((c) => c.key === modalAbierto);
                                    return (
                                        <div
                                            key={jugador.id_jugador}
                                            className={`flex items-center rounded-xl px-4 py-2 transition-transform bg-white/5 hover:bg-white/10 border border-white/10 shadow ${idx < 3 ? "font-bold" : ""
                                                }`}
                                        >
                                            <span className="w-8 text-center text-2xl mr-2">
                                                {medallas[idx] || idx + 1}
                                            </span>
                                            <span className="flex-1 text-white text-lg truncate">
                                                {jugador.nombre} {jugador.apellidos}
                                                <span className="text-white/50 ml-2">
                                                    ({jugador.nombre_equipo})
                                                </span>
                                            </span>
                                            <span
                                                className={`ml-4 px-4 py-1 rounded-full bg-gradient-to-r ${categoria.color} text-white font-bold text-lg shadow`}
                                            >
                                                {jugador[categoria.statKey]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-white/70 text-center py-4">
                                No hay datos para este ranking
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}