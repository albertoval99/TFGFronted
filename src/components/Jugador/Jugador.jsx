import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router";
import { ligaService } from "../../services/liga.service";
import "./Jugador.css";
import ModalEstadisticasJugador from "../Partido/ModalEstadisticasJugador";
import camisetaJugador from "/src/assets/camiseta-jugador.svg";
import calendario from "/src/assets/calendario.svg";
import flechaOpcion from "/src/assets/flecha-opcion.svg";

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

    function obtenerNombreCompleto(usuario) {
        if (usuario.nombre || usuario.apellidos) {
            return `${usuario.nombre ?? ""} ${usuario.apellidos ?? ""}`.trim();
        } else {
            return "Nombre no disponible";
        }
    }

    const nombreCompleto = obtenerNombreCompleto(usuario);
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
                <div className="flex flex-row items-center w-full gap-6 mb-8" style={{ minHeight: 80 }}>                   
                    <div className="flex flex-row items-center bg-black/90 rounded-xl shadow-lg border border-[#40c9ff] overflow-hidden ml-8" style={{ minWidth: 180, height: 80 }}>                      
                        <div className="w-20 h-20 flex items-center justify-center bg-white">
                            <img
                                src={usuario.equipo.escudo}
                                alt="Escudo del equipo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="h-16 border-l-2 border-[#40c9ff] mx-1" />
                        <div className="w-20 h-20 flex items-center justify-center relative">
                            <img
                                src={camisetaJugador}
                                alt="Camiseta"
                                className="w-full h-full"
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-white drop-shadow-lg select-none"
                                style={{
                                    textShadow: "0 2px 8px #232531, 0 0px 2px #40c9ff"
                                }}>
                                {numero}
                            </span>
                        </div>
                    </div>
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
                            <img
                                src={calendario}
                                alt="Calendario"
                                className="h-4 w-4 text-[#40c9ff] mr-1"
                                style={{ display: "inline-block" }}
                            />
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
                <div className="w-full flex flex-col gap-4 px-2 sm:px-8 pb-4 sm:pb-8">
                    {options.map((options) => (
                        <button
                            key={options.label}
                            type="button"
                            onClick={options.action}
                            className="boton-opcion flex items-center justify-between w-full px-6 py-3 bg-neutral-900 border border-[#40c9ff] rounded-xl font-semibold text-white text-lg shadow-md"
                        >
                            <span>{options.label}</span>
                            <img
                                src={flechaOpcion}
                                alt="Flecha"
                                className="boton-icono"
                                style={{ width: 28, height: 28 }}
                            />
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