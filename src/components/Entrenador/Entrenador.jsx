import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router";
import { ligaService } from "../../services/liga.service";


export default function Entrenador() {
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

    const options = [
        { label: "Programar Entrenamientos", route: "/entrenador/jugadores" },
        { label: "Gestionar Plantilla", route: "/entrenador/alineacion" },
        { label: "XXXXXXXXX", route: "/entrenador/calendario" },
    ];

    return (
        <div className="w-full h-screen flex items-center justify-center overflow-hidden">
            <div
                className="relative flex flex-col items-center justify-center bg-black/90 rounded-2xl shadow-2xl mx-2"
                style={{
                    width: "100%",
                    maxWidth: "700px",
                    boxShadow: "0 0 40px 0 #a855f7, 0 0 0 1px #40c9ff"
                }}
            >
                <div className="flex items-center justify-between w-full px-6 py-4">
                    <div className="flex items-center">
                        {usuario?.equipo?.escudo && (
                            <img 
                                src={usuario.equipo.escudo} 
                                alt="Escudo del equipo" 
                                className="w-16 h-16 object-contain mr-4"
                            />
                        )}
                        <div className="flex flex-col">
                            <h3 className="text-white text-lg font-semibold">
                                {usuario?.equipo?.nombre_equipo || "Equipo no asignado"}
                            </h3>
                            <div className="text-gray-400 text-sm flex flex-col">
                                {error ? (
                                    <span className="text-red-500">{error}</span>
                                ) : ligaInfo ? (
                                    <>
                                        <span>{ligaInfo.nombre_liga}{ligaInfo.categoria} - {ligaInfo.grupo}</span>
                                    </>
                                ) : (
                                    <span>Cargando información de la liga...</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <h3 
                            className="text-lg font-semibold"
                            style={{
                                background: "linear-gradient(90deg, #e81cff 0%, #40c9ff 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            {usuario.nombre} {usuario.apellidos}
                        </h3>
                        <span className="text-gray-400 text-sm">Entrenador</span>
                    </div>
                </div>

                <div className="w-full flex flex-col gap-3 px-2 sm:px-8 pb-4 sm:pb-8">
                    {options.map((op) => (
                        <button
                            key={op.route}
                            type="button"
                            onClick={() => navigate(op.route)}
                            className="flex items-center justify-between w-full px-3 sm:px-8 py-2 sm:py-3 bg-neutral-900 border border-[#40c9ff] rounded-xl font-semibold text-white text-base sm:text-lg shadow-md transition-all duration-200 hover:scale-105 hover:border-[#e81cff] focus:outline-none"
                            style={{
                                minHeight: "40px"
                            }}
                        >
                            <span>{op.label}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5 sm:w-6 sm:h-6 text-[#40c9ff] group-hover:text-[#e81cff] transition-colors"
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