import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { userService } from "../../services/usuarios.service";
import addUser from "/src/assets/addUser.svg";
import EditarJugadorModal from './EditarJugadorModal';



export default function GestionarPlantilla() {
    const navigate = useNavigate();
    const [jugadores, setJugadores] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [jugadorEditando, setJugadorEditando] = useState(null);
    const POSICION_COLORS = {
        PT: "bg-blue-600/20 text-blue-400",
        DFC: "bg-green-600/20 text-green-400",
        LI: "bg-yellow-600/20 text-yellow-500",
        LD: "bg-yellow-600/20 text-yellow-500",
        MC: "bg-purple-600/20 text-purple-400",
        MCD: "bg-indigo-600/20 text-indigo-400",
        MI: "bg-pink-600/20 text-pink-400",
        MD: "bg-pink-600/20 text-pink-400",
        EI: "bg-orange-600/20 text-orange-400",
        ED: "bg-orange-600/20 text-orange-400",
        DC: "bg-red-600/20 text-red-400",
    };

    useEffect(() => {
        const fetchJugadores = async () => {
            try {
                const response = await userService.getJugadoresByEquipo();
                if (response.status === 200) {
                    setJugadores(response.jugadores);
                    setError(null);
                } else {
                    setError(response.message);
                    setJugadores([]);
                }
            } catch (error) {
                setError("Error al cargar los jugadores");
                console.log("Error al cargar los jugadores", error)
            } finally {
                setLoading(false);
            }
        };

        fetchJugadores();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-white">Cargando plantilla...</div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-8 pt-32">
            <div className="max-w-4xl mx-auto">
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

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-white">Gestionar Plantilla</h1>
                    <button
                        onClick={() => navigate('/registroJugador')}
                        className="px-4 py-2 bg-gradient-to-r from-[#e81cff] to-[#40c9ff] text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2"
                    >
                        <img src={addUser} alt="Añadir usuario" className="w-5 h-5" />
                        Nuevo Jugador
                    </button>
                </div>

                {error ? (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
                        {error}
                    </div>
                ) : jugadores.length === 0 ? (
                    <div className="bg-neutral-900/50 border border-neutral-800 text-white p-6 rounded-lg text-center">
                        No hay jugadores en la plantilla
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jugadores.map((jugador) => (
                            <div
                                key={jugador.id_jugador}
                                className="bg-black p-6 rounded-lg border border-neutral-800 hover:border-[#40c9ff] transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    {/* Icono camiseta con dorsal */}
                                    <div className="flex-shrink-0 w-12 h-12 mr-4 flex items-center justify-center">
                                        <span className="relative w-12 h-12 flex items-center justify-center">
                                            <svg className="w-12 h-12" viewBox="0 0 40 40" fill="none">
                                                <path d="M10 5 L30 5 L35 15 L32 35 L8 35 L5 15 Z" fill="#232531" stroke="#40c9ff" strokeWidth="2" />
                                                <rect x="13" y="5" width="14" height="6" rx="2" fill="#40c9ff" />
                                            </svg>
                                            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg select-none">
                                                {jugador.numero_camiseta}
                                            </span>
                                        </span>
                                    </div>
                                    {/* Info en línea */}
                                    <div className="flex-1 flex items-center space-x-4">
                                        <span className={`px-3 py-1 rounded-full font-semibold text-xs flex items-center ${POSICION_COLORS[jugador.posicion] || "bg-neutral-700 text-white"}`}>
                                            {jugador.posicion}
                                        </span>
                                        <span className="text-lg font-semibold text-white">{jugador.nombre} {jugador.apellidos}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${jugador.activo ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}>
                                            {jugador.activo ? "Activo" : "Inactivo"}
                                        </span>
                                    </div>
                                    {/* Botones */}
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => setJugadorEditando(jugador)}
                                            className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                            title="Editar jugador"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const response = await userService.eliminarJugador(jugador.id_usuario);

                                                    if (response.status === 200) {
                                                        setJugadores(jugadores.filter(j => j.id_usuario !== jugador.id_usuario));
                                                        setSuccess("Jugador eliminado con éxito");
                                                        setTimeout(() => setSuccess(""), 3000);
                                                    } else {
                                                        setError(response.message || "Error al eliminar el jugador");
                                                    }
                                                } catch (error) {
                                                    console.error("❌ Error al eliminar el jugador:", error);
                                                    setError("Error al eliminar el jugador");
                                                }
                                            }}
                                            className="p-2 text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                                            title="Eliminar jugador"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {jugadorEditando && (
                <EditarJugadorModal
                    jugador={jugadorEditando}
                    onClose={() => setJugadorEditando(null)}
                    onSave={async (datos) => {
                        const response = await userService.editarJugador(jugadorEditando.id_jugador, datos);
                        if (response.status === 200) {
                            setJugadores(jugadores.map(j =>
                                j.id_jugador === jugadorEditando.id_jugador
                                    ? { ...j, ...datos }
                                    : j
                            ));
                            setSuccess("Jugador actualizado con éxito");
                            setTimeout(() => setSuccess(""), 3000);
                            setJugadorEditando(null);
                        }
                        return response;
                    }}
                />
            )}
        </div>

    );

}
