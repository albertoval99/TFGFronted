import { useState, useEffect } from "react";
import maximoGoleador from "/src/assets/maximoGoleador.png";
import mejorJugador from "/src/assets/mejorJugador.png";
import masAmarillas from "/src/assets/masAmarillas.png";
import masRojas from "/src/assets/masRojas.png";
import masTitularidades from "/src/assets/masTitularidades.png";
import { estadisticasService } from "../../services/estadisticas.service";
import "./Estadisticas.css"; 
import ModalEstadisticasJugador from "../Partido/ModalEstadisticasJugador";

const medallas = ["🥇", "🥈", "🥉"];

const CATEGORIAS = [
    {
        key: "goleadores",
        titulo: "Máximo Goleador",
        icono: maximoGoleador,
        fetchPrimero: estadisticasService.getMaximoGoleador,
        fetchRanking: estadisticasService.getMaximosGoleadores,
        statKey: "goles",
        colorClass: "color-goleadores",
        textClass: "text-goleadores",
        shadowClass: "shadow-goleadores"
    },
    {
        key: "mvp",
        titulo: "Mejor Jugador (MVP)",
        icono: mejorJugador,
        fetchPrimero: estadisticasService.getMejorJugador,
        fetchRanking: estadisticasService.getMejoresJugadores,
        statKey: "mejor_jugador",
        colorClass: "color-mvp",
        textClass: "text-mvp",
        shadowClass: "shadow-mvp"
    },
    {
        key: "amarillas",
        titulo: "Más Amarillas",
        icono: masAmarillas,
        fetchPrimero: estadisticasService.getJugadorMasAmarillas,
        fetchRanking: estadisticasService.getJugadoresMasAmarillas,
        statKey: "tarjetas_amarillas",
        colorClass: "color-amarillas",
        textClass: "text-amarillas",
        shadowClass: "shadow-amarillas"
    },
    {
        key: "rojas",
        titulo: "Más Rojas",
        icono: masRojas,
        fetchPrimero: estadisticasService.getJugadorMasRojas,
        fetchRanking: estadisticasService.getJugadoresMasRojas,
        statKey: "tarjetas_rojas",
        colorClass: "color-rojas",
        textClass: "text-rojas",
        shadowClass: "shadow-rojas"
    },
    {
        key: "titularidades",
        titulo: "Más Titularidades",
        icono: masTitularidades,
        fetchPrimero: estadisticasService.getJugadorMasTitularidades,
        fetchRanking: estadisticasService.getJugadoresMasTitularidades,
        statKey: "titularidades",
        colorClass: "color-titularidades",
        textClass: "text-titularidades",
        shadowClass: "shadow-titularidades"
    },
];

export default function Estadisticas() {
    const [primeros, setPrimeros] = useState({});
    const [modalAbierto, setModalAbierto] = useState(null);
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingRanking, setLoadingRanking] = useState(false);
    const [error, setError] = useState("");
    const [modalJugador, setModalJugador] = useState(null);

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
            setRanking(response.data?.slice(0, 7) || []);
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
        <div className="stats-container">
            <div className="stats-content">
                <div className="stats-card">

                    <div className="stats-card-blob-1 animate-blob"></div>
                    <div className="stats-card-blob-2 animate-blob animation-delay-2000"></div>
                    <div className="stats-card-blob-3 animate-blob animation-delay-4000"></div>

                    <div className="stats-card-content">
                        <h1 className="stats-title">JUGADORES MAS DESTACADOS</h1>
                        <div className="stats-grid">
                            {CATEGORIAS.map((categoria) => {
                                const jugador = primeros[categoria.key];
                                return (
                                    <div
                                        key={categoria.key}
                                        onClick={() => abrirModal(categoria.key)}
                                        className="category-card"
                                    >
                                        <div className={`category-card-bg ${categoria.colorClass}`}></div>
                                        <div className="category-card-border"></div>

                                        <div className="category-card-content">
                                            <div className="category-icon-container">
                                                <div className={`category-icon-glow ${categoria.colorClass}`}></div>
                                                <img
                                                    src={categoria.icono}
                                                    alt={categoria.titulo}
                                                    className="category-icon"
                                                />
                                            </div>

                                            <div className="category-info">
                                                <h3 className={`category-title ${categoria.textClass}`}>
                                                    {categoria.titulo}
                                                </h3>
                                                {jugador ? (
                                                    <>
                                                        <p className="player-name">
                                                            {jugador.nombre} {jugador.apellidos}
                                                        </p>
                                                        <p className="team-name">
                                                            {jugador.nombre_equipo}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-white/70">Sin datos</p>
                                                )}
                                            </div>

                                            {jugador && (
                                                <div className="stat-number-container">
                                                    <div className={`stat-number-circle ${categoria.colorClass} ${categoria.shadowClass}`}>
                                                        <span className="stat-number">
                                                            {jugador[categoria.statKey]}
                                                        </span>
                                                    </div>
                                                    <span className="stat-label">Ver ranking</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {modalAbierto && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <div className="modal-title-container">
                                <img
                                    src={CATEGORIAS.find(c => c.key === modalAbierto).icono}
                                    alt="Icono"
                                    className="modal-icon"
                                />
                                <h2 className="modal-title">
                                    Ranking {CATEGORIAS.find((c) => c.key === modalAbierto).titulo}
                                </h2>
                            </div>
                            <button
                                onClick={cerrarModal}
                                className="modal-close-button"
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
                            <div className="modal-loading">
                                <div className="modal-spinner"></div>
                            </div>
                        ) : ranking.length > 0 ? (
                            <div className="modal-ranking">
                                    {ranking.map((jugador, idx) => {
                                        const categoria = CATEGORIAS.find((c) => c.key === modalAbierto);
                                        return (
                                            <div
                                                key={jugador.id_jugador}
                                                className={`ranking-item ${idx < 3 ? "font-bold" : ""} cursor-pointer`}
                                                onClick={() => setModalJugador(jugador.id_jugador)}
                                            >
                                                <span className="ranking-position">
                                                    {medallas[idx] || idx + 1}
                                                </span>
                                                <span className="ranking-player-info">
                                                    {jugador.nombre} {jugador.apellidos}
                                                    <span className="ranking-team">
                                                        ({jugador.nombre_equipo})
                                                    </span>
                                                </span>
                                                <span
                                                    className={`ranking-stat ${categoria.colorClass}`}
                                                >
                                                    {jugador[categoria.statKey]}
                                                </span>
                                            </div>
                                        );
                                    })}
                            </div>
                        ) : (
                            <div className="no-data">
                                No hay datos para este ranking
                            </div>
                        )}
                    </div>
                </div>
            )}
            {modalJugador && (
                <ModalEstadisticasJugador
                    idJugador={modalJugador}
                    onClose={() => setModalJugador(null)}
                />
            )}
        </div>
    );
}