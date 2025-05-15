import { useEffect, useState } from "react";
import { partidosService } from "../../services/partidos.service";
import { useParams } from "react-router";

export default function PartidoEstadisticasCard() {
    const { id_partido } = useParams();
    const [partidoData, setPartidoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchPartidoData() {
            try {
                if (!id_partido) {
                    throw new Error("ID de partido no proporcionado");
                }

                const response = await partidosService.getPartidoById(id_partido);

                if (response.status === 200) {
                    // Accede a response.data.data según la estructura JSON recibida
                    if (!response.data?.data) {
                        throw new Error("No se recibieron datos del partido");
                    }
                    setPartidoData(response.data.data);
                } else {
                    setError(response.message || "Error al cargar los datos del partido");
                }
            } catch (error) {
                setError(error.message || "Error al conectar con el servidor");
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPartidoData();
    }, [id_partido]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#40c9ff]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-lg">
                <p>{error}</p>
            </div>
        );
    }

    if (!partidoData) {
        return (
            <div className="bg-neutral-900/20 border border-neutral-700 text-neutral-300 p-4 rounded-lg">
                <p>No se encontraron datos del partido</p>
            </div>
        );
    }

    const {
        partido = {},
        entrenadoresLocal = [],
        entrenadoresVisitante = [],
        alineacionesLocal = [],
        alineacionesVisitante = [],
        estadisticas = [],
    } = partidoData;

    const titularesLocal = alineacionesLocal.filter((j) => j?.es_titular) || [];
    const suplentesLocal = alineacionesLocal.filter((j) => !j?.es_titular) || [];
    const titularesVisitante = alineacionesVisitante.filter((j) => j?.es_titular) || [];
    const suplentesVisitante = alineacionesVisitante.filter((j) => !j?.es_titular) || [];

    const golesLocal =
        estadisticas.filter(
            (e) => e?.goles > 0 && alineacionesLocal.some((j) => j?.id_jugador === e?.id_jugador)
        ) || [];
    const golesVisitante =
        estadisticas.filter(
            (e) => e?.goles > 0 && alineacionesVisitante.some((j) => j?.id_jugador === e?.id_jugador)
        ) || [];
    const tarjetasAmarillas = estadisticas.filter((e) => e?.tarjetas_amarillas > 0) || [];
    const tarjetasRojas = estadisticas.filter((e) => e?.tarjetas_rojas > 0) || [];
    const mejoresJugadores = estadisticas.filter((e) => e?.mejor_jugador) || [];

    return (
        <div className="bg-[#1c1c24] rounded-xl overflow-hidden shadow-lg border border-neutral-800">
            {/* Encabezado con información básica */}
            <div className="p-4 bg-neutral-900/50 border-b border-neutral-800">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-sm text-neutral-400">Jornada {partido.jornada}</h3>
                        <h2 className="text-xl font-bold text-white">{partido.estadio_nombre}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-neutral-400">
                            {new Date(partido.fecha_partido).toLocaleDateString("es-ES", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                        <p className="text-sm text-neutral-400">{partido.hora_partido}</p>
                    </div>
                </div>
            </div>

            {/* Marcador con escudos */}
            <div className="p-6 bg-gradient-to-b from-neutral-900/50 to-transparent">
                <div className="grid grid-cols-3 items-center gap-4">
                    {/* Equipo Local */}
                    <div className="flex flex-col items-center">
                        <img
                            src={partido.equipo_local_escudo}
                            alt={`Escudo ${partido.equipo_local_nombre}`}
                            className="w-20 h-20 object-contain"
                        />
                        <h3 className="text-lg font-semibold text-white mt-2 text-center">
                            {partido.equipo_local_nombre}
                        </h3>
                    </div>

                    {/* Resultado */}
                    <div className="flex flex-col items-center">
                        <div className="text-4xl font-bold text-white my-2">
                            {partido.goles_local !== null && partido.goles_visitante !== null
                                ? `${partido.goles_local} - ${partido.goles_visitante}`
                                : "VS"}
                        </div>
                    </div>

                    {/* Equipo Visitante */}
                    <div className="flex flex-col items-center">
                        <img
                            src={partido.equipo_visitante_escudo}
                            alt={`Escudo ${partido.equipo_visitante_nombre}`}
                            className="w-20 h-20 object-contain"
                        />
                        <h3 className="text-lg font-semibold text-white mt-2 text-center">
                            {partido.equipo_visitante_nombre}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Alineaciones */}
            <div className="p-6 border-t border-neutral-800">
                <h3 className="text-lg font-semibold text-white mb-4">Alineaciones</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Alineación Local */}
                    <div className="bg-neutral-900/50 p-4 rounded-lg">
                        <h4 className="text-md font-medium text-white mb-3 flex items-center">
                            <img
                                src={partido.equipo_local_escudo}
                                alt={`Escudo ${partido.equipo_local_nombre}`}
                                className="w-6 h-6 object-contain mr-2"
                            />
                            {partido.equipo_local_nombre}
                        </h4>

                        <h5 className="text-sm font-medium text-neutral-400 mb-2">Titulares</h5>
                        <div className="space-y-2">
                            {titularesLocal.map((jugador) => (
                                <div key={jugador.id_jugador} className="flex items-center text-sm">
                                    <span className="w-8 text-neutral-400">{jugador.dorsal}</span>
                                    <span className="text-white">
                                        {jugador.nombre} {jugador.apellidos}
                                    </span>
                                    <span className="ml-auto px-2 py-0.5 bg-neutral-800 rounded text-xs text-neutral-300">
                                        {jugador.posicion}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <h5 className="text-sm font-medium text-neutral-400 mt-4 mb-2">Suplentes</h5>
                        <div className="space-y-2">
                            {suplentesLocal.map((jugador) => (
                                <div key={jugador.id_jugador} className="flex items-center text-sm">
                                    <span className="w-8 text-neutral-400">{jugador.dorsal}</span>
                                    <span className="text-neutral-300">
                                        {jugador.nombre} {jugador.apellidos}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alineación Visitante */}
                    <div className="bg-neutral-900/50 p-4 rounded-lg">
                        <h4 className="text-md font-medium text-white mb-3 flex items-center">
                            <img
                                src={partido.equipo_visitante_escudo}
                                alt={`Escudo ${partido.equipo_visitante_nombre}`}
                                className="w-6 h-6 object-contain mr-2"
                            />
                            {partido.equipo_visitante_nombre}
                        </h4>

                        <h5 className="text-sm font-medium text-neutral-400 mb-2">Titulares</h5>
                        <div className="space-y-2">
                            {titularesVisitante.map((jugador) => (
                                <div key={jugador.id_jugador} className="flex items-center text-sm">
                                    <span className="w-8 text-neutral-400">{jugador.dorsal}</span>
                                    <span className="text-white">
                                        {jugador.nombre} {jugador.apellidos}
                                    </span>
                                    <span className="ml-auto px-2 py-0.5 bg-neutral-800 rounded text-xs text-neutral-300">
                                        {jugador.posicion}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <h5 className="text-sm font-medium text-neutral-400 mt-4 mb-2">Suplentes</h5>
                        <div className="space-y-2">
                            {suplentesVisitante.map((jugador) => (
                                <div key={jugador.id_jugador} className="flex items-center text-sm">
                                    <span className="w-8 text-neutral-400">{jugador.dorsal}</span>
                                    <span className="text-neutral-300">
                                        {jugador.nombre} {jugador.apellidos}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Entrenadores */}
            <div className="p-6 border-t border-neutral-800">
                <h3 className="text-lg font-semibold text-white mb-4">Cuerpo Técnico</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-900/50 p-4 rounded-lg">
                        <h4 className="text-md font-medium text-white mb-3 flex items-center">
                            <img
                                src={partido.equipo_local_escudo}
                                alt={`Escudo ${partido.equipo_local_nombre}`}
                                className="w-6 h-6 object-contain mr-2"
                            />
                            {partido.equipo_local_nombre}
                        </h4>

                        <div className="space-y-2">
                            {entrenadoresLocal.map((entrenador) => (
                                <div key={entrenador.id_usuario} className="text-sm text-white">
                                    {entrenador.nombre} {entrenador.apellidos}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-neutral-900/50 p-4 rounded-lg">
                        <h4 className="text-md font-medium text-white mb-3 flex items-center">
                            <img
                                src={partido.equipo_visitante_escudo}
                                alt={`Escudo ${partido.equipo_visitante_nombre}`}
                                className="w-6 h-6 object-contain mr-2"
                            />
                            {partido.equipo_visitante_nombre}
                        </h4>

                        <div className="space-y-2">
                            {entrenadoresVisitante.map((entrenador) => (
                                <div key={entrenador.id_usuario} className="text-sm text-white">
                                    {entrenador.nombre} {entrenador.apellidos}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="p-6 border-t border-neutral-800">
                <h3 className="text-lg font-semibold text-white mb-4">Estadísticas del Partido</h3>

                {/* Goles */}
                <div className="mb-6">
                    <h4 className="text-md font-medium text-white mb-3">Goles</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-neutral-900/50 p-4 rounded-lg">
                            <h5 className="text-sm font-medium text-neutral-400 mb-2 flex items-center">
                                <img
                                    src={partido.equipo_local_escudo}
                                    alt={`Escudo ${partido.equipo_local_nombre}`}
                                    className="w-5 h-5 object-contain mr-2"
                                />
                                {partido.equipo_local_nombre}
                            </h5>
                            {golesLocal.length > 0 ? (
                                <div className="space-y-2">
                                    {golesLocal.map((jugador) => (
                                        <div key={jugador.id_jugador} className="flex items-center text-sm">
                                            <span className="w-8 text-neutral-400">{jugador.dorsal}</span>
                                            <span className="text-white">
                                                {jugador.nombre} {jugador.apellidos}
                                            </span>
                                            <span className="ml-auto px-2 py-0.5 bg-green-900/30 rounded text-xs text-green-400">
                                                {jugador.goles} gol{jugador.goles !== 1 ? "es" : ""}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-neutral-400">No hubo goles</p>
                            )}
                        </div>

                        <div className="bg-neutral-900/50 p-4 rounded-lg">
                            <h5 className="text-sm font-medium text-neutral-400 mb-2 flex items-center">
                                <img
                                    src={partido.equipo_visitante_escudo}
                                    alt={`Escudo ${partido.equipo_visitante_nombre}`}
                                    className="w-5 h-5 object-contain mr-2"
                                />
                                {partido.equipo_visitante_nombre}
                            </h5>
                            {golesVisitante.length > 0 ? (
                                <div className="space-y-2">
                                    {golesVisitante.map((jugador) => (
                                        <div key={jugador.id_jugador} className="flex items-center text-sm">
                                            <span className="w-8 text-neutral-400">{jugador.dorsal}</span>
                                            <span className="text-white">
                                                {jugador.nombre} {jugador.apellidos}
                                            </span>
                                            <span className="ml-auto px-2 py-0.5 bg-green-900/30 rounded text-xs text-green-400">
                                                {jugador.goles} gol{jugador.goles !== 1 ? "es" : ""}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-neutral-400">No hubo goles</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tarjetas */}
                <div className="mb-6">
                    <h4 className="text-md font-medium text-white mb-3">Tarjetas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-neutral-900/50 p-4 rounded-lg">
                            <h5 className="text-sm font-medium text-neutral-400 mb-2">Amarillas</h5>
                            {tarjetasAmarillas.length > 0 ? (
                                <div className="space-y-2">
                                    {tarjetasAmarillas.map((jugador) => (
                                        <div key={jugador.id_jugador} className="flex items-center text-sm">
                                            <span className="w-8 text-neutral-400">{jugador.dorsal}</span>
                                            <span className="text-white">
                                                {jugador.nombre} {jugador.apellidos}
                                            </span>
                                            <span className="ml-auto px-2 py-0.5 bg-yellow-900/30 rounded text-xs text-yellow-400">
                                                {jugador.tarjetas_amarillas} amarilla
                                                {jugador.tarjetas_amarillas !== 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-neutral-400">No hubo tarjetas amarillas</p>
                            )}
                        </div>

                        <div className="bg-neutral-900/50 p-4 rounded-lg">
                            <h5 className="text-sm font-medium text-neutral-400 mb-2">Rojas</h5>
                            {tarjetasRojas.length > 0 ? (
                                <div className="space-y-2">
                                    {tarjetasRojas.map((jugador) => (
                                        <div key={jugador.id_jugador} className="flex items-center text-sm">
                                            <span className="w-8 text-neutral-400">{jugador.dorsal}</span>
                                            <span className="text-white">
                                                {jugador.nombre} {jugador.apellidos}
                                            </span>
                                            <span className="ml-auto px-2 py-0.5 bg-red-900/30 rounded text-xs text-red-400">
                                                {jugador.tarjetas_rojas} roja
                                                {jugador.tarjetas_rojas !== 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-neutral-400">No hubo tarjetas rojas</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mejores Jugadores */}
                <div className="mb-6">
                    <h4 className="text-md font-medium text-white mb-3">Mejores Jugadores</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mejoresJugadores.length > 0 ? (
                            mejoresJugadores.map((jugador) => (
                                <div
                                    key={jugador.id_jugador}
                                    className="bg-neutral-900/50 p-4 rounded-lg flex items-center"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#e81cff] to-[#40c9ff] flex items-center justify-center text-white font-bold mr-3">
                                        {jugador.dorsal}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">
                                            {jugador.nombre} {jugador.apellidos}
                                        </p>
                                        <p className="text-xs text-neutral-400">
                                            {alineacionesLocal
                                                .concat(alineacionesVisitante)
                                                .find((j) => j.id_jugador === jugador.id_jugador)?.posicion}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-neutral-400">No se seleccionaron mejores jugadores</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Árbitro */}
            <div className="p-6 border-t border-neutral-800 bg-neutral-900/50">
                <h3 className="text-lg font-semibold text-white mb-3">Árbitro</h3>
                <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold mr-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                            />
                        </svg>
                    </div>
                    <div>
                        <p className="text-white font-medium">
                            {partido.arbitro_nombre} {partido.arbitro_apellidos}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}