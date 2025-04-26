import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router";
import { ligaService } from "../../services/liga.service";
import "./Jugador.css";

export default function Jugador() {
    const { usuario } = useOutletContext();
    const navigate = useNavigate();
    const idLiga = usuario?.equipo?.id_liga;
    const [ligaInfo, setLigaInfo] = useState(null);
    const [error, setError] = useState(null);

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
        { label: "Ver Estadísticas", route: "/jugador/estadisticas" },
        { label: "Ver Entrenamientos", route: "/verEntrenamientosJugador" },
        { label: "Actualizar Perfil", route: "/jugador/perfil" },
    ];

    return (
        <div className="w-full h-screen flex items-center justify-center overflow-hidden">
            <div className="relative flex flex-col bg-black/90 rounded-2xl shadow-2xl mx-2 p-8 jugador-container">
                <div className="flex items-center justify-between w-full mb-8">
                    <div className="flex items-center space-x-6 flex-1 min-w-0">
                        {usuario?.equipo?.escudo && (
                            <img
                                src={usuario.equipo.escudo}
                                alt="Escudo del equipo"
                                className="w-20 h-20 object-contain flex-shrink-0"
                            />
                        )}
                        <div className="min-w-0">
                            <h1 className="text-4xl font-extrabold truncate leading-tight nombre-gradiente">
                                {nombreCompleto}
                            </h1>
                            <h2 className="text-gray-300 text-lg mt-1 truncate">
                                {usuario?.equipo?.nombre_equipo || "Equipo no asignado"}
                            </h2>
                            <p className="text-gray-400 text-sm mt-2 flex items-center space-x-2 truncate max-w-xs">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-[#40c9ff]"
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
                            </p>
                        </div>
                    </div>

                    {/* Derecha: Posición y número */}
                    <div className="text-right min-w-[140px] ml-6">
                        <p className="text-gray-400 tracking-wider font-semibold mb-2">Jugador</p>
                        <div className="bg-neutral-900 rounded-lg p-4 shadow-inner">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-400 font-medium">Posición:</span>
                                <span className="text-white font-bold">{posicion}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 font-medium">Número:</span>
                                <span className="text-white font-bold">{numero}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="w-full flex flex-col gap-4 px-2 sm:px-8 pb-4 sm:pb-8">
                    {options.map((op) => (
                        <button
                            key={op.route}
                            type="button"
                            onClick={() => navigate(op.route)}
                            className="flex items-center justify-between w-full px-6 py-3 bg-neutral-900 border border-[#40c9ff] rounded-xl font-semibold text-white text-lg shadow-md boton-opcion"
                        >
                            <span>{op.label}</span>
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
            </div>
        </div>
    );
}