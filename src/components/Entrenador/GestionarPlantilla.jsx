import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { userService } from "../../services/usuarios.service";
import addUser from "/src/assets/addUser.svg";
import camisetaJugador from "/src/assets/camiseta-jugador.svg";
import iconoEditar from "/src/assets/icono-editar.svg";
import iconoEliminar from "/src/assets/icono-eliminar.svg";
import EditarJugadorModal from './EditarJugadorModal';
import { Mensaje } from "../Error/Mensaje";

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

    async function handleEliminarJugador(id_usuario) {
        try {
            const response = await userService.eliminarJugador(id_usuario);

            if (response.status === 200) {
                setJugadores(jugadores.filter(j => j.id_usuario !== id_usuario));
                setSuccess("Jugador eliminado con éxito");
                setTimeout(() => setSuccess(""), 3000);
            } else {
                setError(response.message || "Error al eliminar el jugador");
            }
        } catch (error) {
            console.error("❌ Error al eliminar el jugador:", error);
            setError("Error al eliminar el jugador");
        }
    }
    async function handleGuardarJugador(id_jugador, datos) {
        const response = await userService.editarJugador(id_jugador, datos);
        if (response.status === 200) {
            const jugadoresActualizados = [];
            for (let i = 0; i < jugadores.length; i++) {
                const jugadorActual = jugadores[i];
                if (jugadorActual.id_jugador === id_jugador) {
                    const jugadorActualizado = {
                        ...jugadorActual,
                        ...datos
                    };
                    jugadoresActualizados.push(jugadorActualizado);
                } else {
                    jugadoresActualizados.push(jugadorActual);
                }
            }
            setJugadores(jugadoresActualizados);
            setSuccess("Jugador actualizado con éxito");
            setTimeout(() => { setSuccess("") }, 3000);
            setJugadorEditando(null);
        }

        return response;
    }

    useEffect(() => {
        async function fetchJugadores() {
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
        }

        fetchJugadores();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#40c9ff]"></div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-8 pt-32">
            <div className="max-w-4xl mx-auto">
                <Mensaje
                    error={error}
                    success={success}
                    onClose={() => { setError(""); setSuccess(""); }}
                />
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

                {jugadores.length === 0 ? (
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
                                    <div className="flex-shrink-0 w-12 h-12 mr-4 flex items-center justify-center">
                                        <span className="relative w-12 h-12 flex items-center justify-center">
                                            <img
                                                src={camisetaJugador}
                                                alt="Camiseta"
                                                className="w-12 h-12"
                                            />
                                            <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg select-none">
                                                {jugador.numero_camiseta}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex-1 flex items-center space-x-4">
                                        <span className={`px-3 py-1 rounded-full font-semibold text-xs flex items-center ${POSICION_COLORS[jugador.posicion] || "bg-neutral-700 text-white"}`}>
                                            {jugador.posicion}
                                        </span>
                                        <span className="text-lg font-semibold text-white">{jugador.nombre} {jugador.apellidos}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${jugador.activo ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}>
                                            {jugador.activo ? "Activo" : "Inactivo"}
                                        </span>
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => setJugadorEditando(jugador)}
                                            className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                            title="Editar jugador"
                                        >
                                            <img
                                                src={iconoEditar}
                                                alt="Editar"
                                                className="w-6 h-6"
                                            />
                                        </button>
                                        <button
                                            onClick={() => handleEliminarJugador(jugador.id_usuario)}
                                            className="p-2 text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                                            title="Eliminar jugador"
                                        >
                                            <img
                                                src={iconoEliminar}
                                                alt="Eliminar"
                                                className="w-6 h-6"
                                            />
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
                        const idJugadorAEditar = jugadorEditando.id_jugador;
                        const resultado = await handleGuardarJugador(idJugadorAEditar, datos);
                        return resultado;
                    }}
                />
            )}
        </div>
    );
}