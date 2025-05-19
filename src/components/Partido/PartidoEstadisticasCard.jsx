import { useEffect, useState } from "react";
import { partidosService } from "../../services/partidos.service";
import { useParams } from "react-router";
import "./PartidoEstadisticasCard.css";
import estadio from "/src/assets/estadio.svg";
import arbitro from "/src/assets/arbitro.svg";
import ModalEstadisticasJugador from "./ModalEstadisticasJugador";
export default function PartidoEstadisticasCard() {
    const { id_partido } = useParams();
    const [partidoData, setPartidoData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalJugador, setModalJugador] = useState(null);

    useEffect(() => {
        async function fetchPartidoData() {
            try {
                if (!id_partido) throw new Error("ID de partido no proporcionado");
                const response = await partidosService.getPartidoById(id_partido);
                if (response.status === 200) {
                    if (!response.data?.data) throw new Error("No se recibieron datos del partido");
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
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#40c9ff]"></div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="partido-error">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (!partidoData) {
        return (
            <div className="partido-empty">
                <span>No se encontraron datos del partido</span>
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
    const golesLocal = estadisticas.filter((e) => e?.goles > 0 && alineacionesLocal.some((j) => j?.id_jugador === e?.id_jugador)) || [];
    const golesVisitante = estadisticas.filter((e) => e?.goles > 0 && alineacionesVisitante.some((j) => j?.id_jugador === e?.id_jugador)) || [];
    const tarjetasAmarillas = estadisticas.filter((e) => e?.tarjetas_amarillas > 0) || [];
    const tarjetasRojas = estadisticas.filter((e) => e?.tarjetas_rojas > 0) || [];
    const mejoresJugadores = estadisticas.filter((e) => e?.mejor_jugador) || [];

    return (
        <div className="partido-container">
            <div className="partido-card">
                <div className="partido-grid">
                    {/* Columna Izquierda */}
                    <div className="columna-izquierda">
                        {/* Header con fecha */}
                        <header className="partido-header">
                            <div className="header-info">
                                <span className="jornada">Jornada {partido.jornada}</span>
                                <h2 className="estadio">
                                    <img src={estadio} alt="Estadio Icon" className="estadio-icon" />
                                    {partido.estadio_nombre}</h2></div>
                            <div className="header-fecha">
                                <time className="fecha">
                                    {new Date(partido.fecha_partido).toLocaleDateString("es-ES", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </time>
                                <span className="hora">
                                    {partido.hora_partido.substring(0, 5)}
                                </span>
                            </div>
                        </header>

                        {/* Resultado */}
                        <section className="partido-resultado">
                            <div className="equipo-info">
                                <div className="escudo-container">
                                    <img src={partido.equipo_local_escudo} alt={partido.equipo_local_nombre} />
                                </div>

                            </div>

                            <div className="marcador">
                                <span>{partido.goles_local !== null ? partido.goles_local : "-"}</span>
                                <span className="separador">-</span>
                                <span>{partido.goles_visitante !== null ? partido.goles_visitante : "-"}</span>
                            </div>

                            <div className="equipo-info">
                                <div className="escudo-container">
                                    <img src={partido.equipo_visitante_escudo} alt={partido.equipo_visitante_nombre} />
                                </div>
                            </div>
                        </section>

                        {/* Goles */}
                        <section className="seccion-goles">
                            <h3 className="seccion-titulo">Goles</h3>
                            <div className="goles-container">
                                <div className="equipo-goles">
                                    <h4>
                                        <img src={partido.equipo_local_escudo} alt={partido.equipo_local_nombre} />
                                        {partido.equipo_local_nombre}
                                    </h4>
                                    {golesLocal.length > 0 ? (
                                        golesLocal.map(jugador => (
                                            <div key={jugador.id_jugador} className="gol-item">
                                                <span className="dorsal">{jugador.dorsal}</span>
                                                <span className="nombre">{jugador.nombre} {jugador.apellidos}</span>
                                                <span className="relative w-10 h-10 flex items-center justify-center">
                                                    {/* Balón SVG */}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 -960 960 960"
                                                        className="w-10 h-10"
                                                        fill="#fff"
                                                        stroke="#232531"
                                                        strokeWidth="20"
                                                    >
                                                        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm200-500 54-18 16-54q-32-48-77-82.5T574-786l-54 38v56l160 112Zm-400 0 160-112v-56l-54-38q-54 17-99 51.5T210-652l16 54 54 18Zm-42 308 46-4 30-54-58-174-56-20-40 30q0 65 18 118.5T238-272Zm242 112q26 0 51-4t49-12l28-60-26-44H378l-26 44 28 60q24 8 49 12t51 4Zm-90-200h180l56-160-146-102-144 102 54 160Zm332 88q42-50 60-103.5T800-494l-40-28-56 18-58 174 30 54 46 4Z" />
                                                    </svg>
                                                    {/* Badge de goles */}
                                                    <span
                                                        className="absolute -top-2 -right-2 flex items-center justify-center rounded-full bg-[#40c9ff] text-white font-bold text-xs w-6 h-6 border-2 border-white shadow"
                                                        style={{ zIndex: 2 }}
                                                    >
                                                        {jugador.goles}
                                                    </span>
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data">Sin goles</p>
                                    )}
                                </div>

                                <div className="equipo-goles">
                                    <h4>
                                        <img src={partido.equipo_visitante_escudo} alt={partido.equipo_visitante_nombre} />
                                        {partido.equipo_visitante_nombre}
                                    </h4>
                                    {golesVisitante.length > 0 ? (
                                        golesVisitante.map(jugador => (
                                            <div key={jugador.id_jugador} className="gol-item">
                                                <span className="dorsal">{jugador.dorsal}</span>
                                                <span className="nombre">{jugador.nombre} {jugador.apellidos}</span>
                                                <span className="relative w-10 h-10 flex items-center justify-center">
                                                    {/* Balón SVG */}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 -960 960 960"
                                                        className="w-10 h-10"
                                                        fill="#fff"
                                                        stroke="#232531"
                                                        strokeWidth="20"
                                                    >
                                                        <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm200-500 54-18 16-54q-32-48-77-82.5T574-786l-54 38v56l160 112Zm-400 0 160-112v-56l-54-38q-54 17-99 51.5T210-652l16 54 54 18Zm-42 308 46-4 30-54-58-174-56-20-40 30q0 65 18 118.5T238-272Zm242 112q26 0 51-4t49-12l28-60-26-44H378l-26 44 28 60q24 8 49 12t51 4Zm-90-200h180l56-160-146-102-144 102 54 160Zm332 88q42-50 60-103.5T800-494l-40-28-56 18-58 174 30 54 46 4Z" />
                                                    </svg>
                                                    {/* Badge de goles */}
                                                    <span
                                                        className="absolute -top-2 -right-2 flex items-center justify-center rounded-full bg-[#40c9ff] text-white font-bold text-xs w-6 h-6 border-2 border-white shadow"
                                                        style={{ zIndex: 2 }}
                                                    >
                                                        {jugador.goles}
                                                    </span>
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data">Sin goles</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Tarjetas */}
                        <section className="seccion-tarjetas">
                            <h3 className="seccion-titulo">Tarjetas</h3>
                            <div className="tarjetas-container">
                                <div className="tarjetas-tipo">
                                    <h4>Amarillas</h4>
                                    {tarjetasAmarillas.length > 0 ? (
                                        tarjetasAmarillas.map(jugador => (
                                            <div key={jugador.id_jugador} className="tarjeta-item amarilla">
                                                <span className="dorsal">{jugador.dorsal}</span>
                                                <span className="nombre">{jugador.nombre} {jugador.apellidos}</span>
                                                <span className="cantidad flex items-center justify-center">
                                                    <span className="relative w-7 h-9 flex items-center justify-center">
                                                        <svg className="w-7 h-9" viewBox="0 0 28 36" fill="none">
                                                            <rect x="2" y="2" width="24" height="32" rx="3" fill="#ffe066" stroke="#e6c200" strokeWidth="2" />
                                                        </svg>
                                                        <span className="absolute inset-0 flex items-center justify-center text-black font-bold text-base select-none">
                                                            {jugador.tarjetas_amarillas}
                                                        </span>
                                                    </span>
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data">Sin tarjetas amarillas</p>
                                    )}
                                </div>

                                <div className="tarjetas-tipo">
                                    <h4>Rojas</h4>
                                    {tarjetasRojas.length > 0 ? (
                                        tarjetasRojas.map(jugador => (
                                            <div key={jugador.id_jugador} className="tarjeta-item roja">
                                                <span className="dorsal">{jugador.dorsal}</span>
                                                <span className="nombre">{jugador.nombre} {jugador.apellidos}</span>
                                                <span className="cantidad flex items-center justify-center">
                                                    <span className="relative w-7 h-9 flex items-center justify-center">
                                                        <svg className="w-7 h-9" viewBox="0 0 28 36" fill="none">
                                                            <rect x="2" y="2" width="24" height="32" rx="3" fill="#ff4d4f" stroke="#b30000" strokeWidth="2" />
                                                        </svg>
                                                        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-base select-none">
                                                            {jugador.tarjetas_rojas}
                                                        </span>
                                                    </span>
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data">Sin tarjetas rojas</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Mejores Jugadores */}
                        <section className="seccion-mejores">
                            <h3 className="seccion-titulo">Mejores Jugadores</h3>
                            <div className="mejores-container">
                                {mejoresJugadores.length > 0 ? (
                                    mejoresJugadores.map(jugador => (
                                        <div key={jugador.id_jugador} className="mejor-jugador flex items-center space-x-2">
                                            <span className="dorsal">{jugador.dorsal}</span>
                                            <div className="info flex items-center space-x-2">
                                                {/* Icono MVP */}
                                                <span className="nombre">{jugador.nombre} {jugador.apellidos}</span>
                                                <span className="relative w-7 h-7 flex items-center justify-center">
                                                    <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                                                        <circle cx="16" cy="16" r="15" fill="#232531" stroke="#40c9ff" strokeWidth="2" />
                                                        <polygon points="16,6 19,14 28,14 21,19 24,27 16,22 8,27 11,19 4,14 13,14" fill="#ffe066" stroke="#e6c200" strokeWidth="1" />
                                                    </svg>
                                                </span>
                                            </div>
                                      </div>
                                    ))
                                ) : (
                                    <p className="no-data">No se seleccionaron mejores jugadores</p>
                                )}
                            </div>
                        </section>

                        {/* Árbitro */}
                        <section className="seccion-arbitro">
                            <h3 className="seccion-titulo">Árbitro</h3>
                            <div className="arbitro-info">
                                <div className="arbitro-icon">
                                    <img src={arbitro} alt="Árbitro Icon" />
                                </div>
                                <span className="arbitro-nombre">
                                    {partido.arbitro_nombre} {partido.arbitro_apellidos}
                                </span>
                            </div>
                        </section>
                    </div>

                    {/* Columna Derecha */}
                    <div className="columna-derecha">
                        {/* Contenido Equipo Local */}
                        <section className="seccion-equipo">
                            <div className="equipo-header">
                                <img src={partido.equipo_local_escudo} alt={partido.equipo_local_nombre} />
                                <h3>{partido.equipo_local_nombre}</h3>
                            </div>



                            {/* Alineación Local */}
                            <div className="alineacion">
                                <div className="titulares">
                                    <h4>Titulares</h4>
                                    {titularesLocal.map(jugador => (
                                        <div key={jugador.id_jugador} className="jugador" onClick={() => setModalJugador({
                                            id: jugador.id_jugador
                                        })}>
                                            <span className="dorsal">{jugador.dorsal}</span>
                                            <span className="nombre">{jugador.nombre} {jugador.apellidos}</span>
                                            <span className="posicion">{jugador.posicion}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="suplentes">
                                    <h4>Suplentes</h4>
                                    {suplentesLocal.map(jugador => (
                                        <div key={jugador.id_jugador} className="jugador" onClick={() => setModalJugador({
                                            id: jugador.id_jugador
                                        })}>
                                            <span className="dorsal">{jugador.dorsal}</span>
                                            <span className="nombre">{jugador.nombre} {jugador.apellidos}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Entrenadores Local */}
                                <div className="entrenadores">
                                    <h4>Cuerpo Técnico</h4>
                                    <div className="entrenadores-lista">
                                        {entrenadoresLocal.map(entrenador => (
                                            <div key={entrenador.id_usuario} className="entrenador">
                                                <span className="nombre">
                                                    {entrenador.nombre} {entrenador.apellidos}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Contenido Equipo Visitante */}
                        <section className="seccion-equipo">
                            <div className="equipo-header">
                                <img src={partido.equipo_visitante_escudo} alt={partido.equipo_visitante_nombre} />
                                <h3>{partido.equipo_visitante_nombre}</h3>
                            </div>



                            {/* Alineación Visitante */}
                            <div className="alineacion">
                                <div className="titulares">
                                    <h4>Titulares</h4>
                                    {titularesVisitante.map(jugador => (
                                        <div key={jugador.id_jugador} className="jugador" onClick={() => setModalJugador({
                                            id: jugador.id_jugador
                                        })}>
                                            <span className="dorsal">{jugador.dorsal}</span>
                                            <span className="nombre">{jugador.nombre} {jugador.apellidos}</span>
                                            <span className="posicion">{jugador.posicion}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="suplentes">
                                    <h4>Suplentes</h4>
                                    {suplentesVisitante.map(jugador => (
                                        <div key={jugador.id_jugador} className="jugador" onClick={() => setModalJugador({
                                            id: jugador.id_jugador
                                        })}>
                                            <span className="dorsal">{jugador.dorsal}</span>
                                            <span className="nombre">{jugador.nombre} {jugador.apellidos}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Entrenadores Visitante */}
                                <div className="entrenadores">
                                    <h4>Cuerpo Técnico</h4>
                                    <div className="entrenadores-lista">
                                        {entrenadoresVisitante.map(entrenador => (
                                            <div key={entrenador.id_usuario} className="entrenador">
                                                <span className="nombre">
                                                    {entrenador.nombre} {entrenador.apellidos}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            {modalJugador && (
                <ModalEstadisticasJugador
                    idJugador={modalJugador.id}
                    onClose={() => setModalJugador(null)}
                />
            )}
        </div>
    );
}