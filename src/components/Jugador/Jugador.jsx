import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router";
import { ligaService } from "../../services/liga.service";
import "./Jugador.css";
import ModalEstadisticasJugador from "../Partido/ModalEstadisticasJugador";

export default function Jugador() {
    const { usuario } = useOutletContext();
    const navigate = useNavigate();
    const idLiga = usuario?.equipo?.id_liga;
    const [ligaInfo, setLigaInfo] = useState(null);
    const [error, setError] = useState(null);
    const [modalEstadisticas, setModalEstadisticas] = useState(false);

    const POSICION_COLORS = {
        PT: "bg-blue-600/20 text-blue-400 border-blue-400",
        DFC: "bg-green-600/20 text-green-400 border-green-400",
        LI: "bg-yellow-600/20 text-yellow-500 border-yellow-500",
        LD: "bg-yellow-600/20 text-yellow-500 border-yellow-500",
        MC: "bg-purple-600/20 text-purple-400 border-purple-400",
        MCD: "bg-indigo-600/20 text-indigo-400 border-indigo-400",
        MI: "bg-pink-600/20 text-pink-400 border-pink-400",
        MD: "bg-pink-600/20 text-pink-400 border-pink-400",
        EI: "bg-orange-600/20 text-orange-400 border-orange-400",
        ED: "bg-orange-600/20 text-orange-400 border-orange-400",
        DC: "bg-red-600/20 text-red-400 border-red-400",
    };

    useEffect(() => {
        const fetchLiga = async () => {
            if (idLiga) {
                const response = await ligaService.getLigaById(idLiga);
                if (response.status === 200) {
                    setLigaInfo(response.liga);
                    setError(null);
                } else {
                    setError(response.message);
                    setLigaInfo(null);
                }
            }
        };
        fetchLiga();
    }, [idLiga]);

    if (!usuario) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-white text-xl">Cargando usuario...</p>
            </div>
        );
    }

    const nombreCompleto = usuario.nombre || usuario.apellidos
        ? `${usuario.nombre ?? ""} ${usuario.apellidos ?? ""}`.trim()
        : "Nombre no disponible";

    const posicion = usuario.posicion || "No asignada";
    const numero = usuario.numero_camiseta || "No asignado";

    const options = [
        { label: "Ver Estadísticas", action: () => setModalEstadisticas(true) },
        { label: "Ver Entrenamientos", action: () => navigate("/verEntrenamientosJugador") },
        { label: "Actualizar Perfil", action: () => navigate("/actualizarPerfil") },
    ];

    return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className="jugador-container flex flex-col bg-black/90 rounded-2xl shadow-2xl mx-2 p-8 max-w-2xl w-full relative">
                {/* Header: contenedor escudo+dorsal y datos */}
                <div className="flex flex-row items-center w-full gap-6 mb-8" style={{ minHeight: 80 }}>
                    {/* Contenedor escudo + dorsal con margen a la izquierda */}
                    <div className="flex flex-row items-center bg-black/90 rounded-xl shadow-lg border border-[#40c9ff] overflow-hidden ml-8" style={{ minWidth: 180, height: 80 }}>
                        {/* Escudo */}
                        <div className="w-20 h-20 flex items-center justify-center bg-white">
                            <img
                                src={usuario.equipo.escudo}
                                alt="Escudo del equipo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        {/* Separador vertical */}
                        <div className="h-16 border-l-2 border-[#40c9ff] mx-1" />
                        {/* Dorsal con camiseta */}
                        <div className="w-20 h-20 flex items-center justify-center relative">
                            <svg className="w-full h-full" viewBox="0 0 40 40" fill="none">
                                <defs>
                                    <linearGradient id="camisetaGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#e81cff" />
                                        <stop offset="1" stopColor="#40c9ff" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M10 5 L30 5 L35 15 L32 35 L8 35 L5 15 Z"
                                    fill="url(#camisetaGrad)"
                                    opacity="0.85"
                                    stroke="#fff"
                                    strokeWidth="2"
                                />
                                <rect x="13" y="5" width="14" height="6" rx="2" fill="#fff" opacity="0.25" />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-white drop-shadow-lg select-none"
                                style={{
                                    textShadow: "0 2px 8px #232531, 0 0px 2px #40c9ff"
                                }}>
                                {numero}
                            </span>
                        </div>
                    </div>
                    {/* Datos */}
                    <div className="flex flex-col justify-center flex-1 min-w-0">
                        <div className="flex items-center w-full">
                            <h1 className="nombre-gradiente font-extrabold text-xl sm:text-2xl truncate">
                                {nombreCompleto}
                            </h1>
                            {posicion !== "No asignada" && (
                                <span className={`ml-3 px-3 py-1 rounded-full font-semibold text-xs border ${POSICION_COLORS[posicion] || "bg-neutral-700 text-white border-neutral-700"}`}>
                                    {posicion}
                                </span>
                            )}
                        </div>
                        <h2 className="text-gray-300 text-base truncate">
                            {usuario?.equipo?.nombre_equipo || "Equipo no asignado"}
                        </h2>
                        <div className="flex items-center text-gray-400 text-sm truncate">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-[#40c9ff] mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-5H3v5a2 2 0 002 2z" />
                            </svg>
                            {error ? (
                                <span className="text-red-500">{error}</span>
                            ) : ligaInfo ? (
                                <span>
                                    {ligaInfo.nombre_liga} {ligaInfo.categoria} - {ligaInfo.grupo}
                                </span>
                            ) : (
                                <span>Cargando información de la liga...</span>
                            )}
                        </div>
                    </div>
                </div>
    
                {/* Botones debajo */}
                <div className="w-full flex flex-col gap-4 px-2 sm:px-8 pb-4 sm:pb-8">
                    {options.map((options) => (
                        <button
                            key={options.label}
                            type="button"
                            onClick={options.action}
                            className="boton-opcion flex items-center justify-between w-full px-6 py-3 bg-neutral-900 border border-[#40c9ff] rounded-xl font-semibold text-white text-lg shadow-md"
                        >
                            <span>{options.label}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="boton-icono"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 12H6.75m7.5 0l-3-3m3 3l-3 3" />
                            </svg>
                        </button>
                    ))}
                </div>

                
                {modalEstadisticas && (
                    <ModalEstadisticasJugador
                        idJugador={usuario.id_jugador}
                        onClose={() => setModalEstadisticas(false)}
                    />
                )}
            </div>
        </div>
    );
}