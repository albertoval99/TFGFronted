import { useEffect, useState } from "react";
import { partidosService } from "../../services/partidos.service";
import { equipoService } from "../../services/equipos.service";
import "./Arbitro.css";
import aplazarPartidoIcon from "/src/assets/aplazarPartido.svg";
import registrarPartidoIcon from "/src/assets/registrarPartido.svg";
import AplazarPartidoModal from "./AplazarPartidoModal";
import RegistrarPartidoModal from "./RegistrarPartidoModal";
import { Mensaje } from "../Error/Mensaje";
import relojIcon from "/src/assets/reloj.svg";
import estadioIcon from "/src/assets/estadio.svg";

export default function VerPartidosAsignados() {
    const [partidos, setPartidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const [slide, setSlide] = useState(0);
    const [partidoEditando, setPartidoEditando] = useState(null);
    const [estadios, setEstadios] = useState([]);
    const [partidoRegistrando, setPartidoRegistrando] = useState(null);
    const [showModal, setShowModal] = useState(false);

    
    function fechaLarga(fechaStr) {
        if (!fechaStr || typeof fechaStr !== "string") return "Fecha por determinar";

        let fecha;
        if (fechaStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const [day, month, year] = fechaStr.split("/");
            fecha = new Date(Number(year), Number(month) - 1, Number(day));
        } else if (fechaStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = fechaStr.split("-");
            fecha = new Date(Number(year), Number(month) - 1, Number(day));
        } else {
            fecha = new Date(fechaStr);
        }

        if (isNaN(fecha.getTime())) return "Fecha por determinar";

        return fecha.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    
    function parsearFecha(fechaStr, horaStr = null) {
        let fecha;

        if (fechaStr.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const [day, month, year] = fechaStr.split("/");
            fecha = new Date(Number(year), Number(month) - 1, Number(day));
        } else if (fechaStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = fechaStr.split("-");
            fecha = new Date(Number(year), Number(month) - 1, Number(day));
        } else {
            fecha = new Date(fechaStr);
        }

        if (horaStr) {
            const [h, m] = horaStr.split(":");
            fecha.setHours(Number(h), Number(m), 0, 0);
        } else {
            fecha.setHours(0, 0, 0, 0);
        }

        return fecha;
    }

    function puedeSuspender(partido) {
        const fechaPartido = parsearFecha(partido.fecha_partido, partido.hora_partido);
        const ahora = new Date();
        return ahora < fechaPartido;
    }

    function puedeRegistrar(partido) {
        const fechaPartido = parsearFecha(partido.fecha_partido, partido.hora_partido);
        const ahora = new Date();
        return ahora >= fechaPartido;
    }

    
    function irPartidoAnterior() {
        setSlide(s => Math.max(0, s - 1));
    }

    function irPartidoSiguiente() {
        setSlide(s => Math.min(partidos.length - 1, s + 1));
    }

    
    async function cargarPartidos(idArbitro) {
        setLoading(true);
        setError(null);
        try {
            const response = await partidosService.getPartidosByArbitro(idArbitro);
            if (response.status === 200 && Array.isArray(response.data)) {
                const partidosOrdenados = response.data.sort(
                    (a, b) => new Date(a.fecha_partido) - new Date(b.fecha_partido)
                );
                setPartidos(partidosOrdenados);

                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                let idx = partidosOrdenados.findIndex((p) => {
                    const fecha = parsearFecha(p.fecha_partido);
                    return fecha >= hoy;
                });
                if (idx === -1) idx = partidosOrdenados.length - 1;
                setSlide(idx >= 0 ? idx : 0);
            } else {
                setError(response.message || "No se han encontrado partidos");
            }
        } catch (err) {
            setError("Error al cargar los partidos");
            console.log("Error al cargar los partidos", err);
        } finally {
            setLoading(false);
        }
    }

    
    async function handleGuardarAplazamiento(datos) {
        if (!partidoEditando) return;

        const estadioSeleccionado = estadios.find(e => e.id_estadio === Number(datos.id_estadio));
        const nuevaUbicacion = estadioSeleccionado ? estadioSeleccionado.ubicacion : partidoEditando.ubicacion_estadio;

        const response = await partidosService.aplazarPartido(partidoEditando.id_partido, datos);
        if (response.status === 200) {
            setPartidos((prev) =>
                prev.map((p) =>
                    p.id_partido === partidoEditando.id_partido
                        ? { ...p, ...datos, ubicacion_estadio: nuevaUbicacion }
                        : p
                )
            );
            setSuccess("Partido aplazado correctamente");
            setTimeout(() => setSuccess(""), 3000);
            setPartidoEditando(null);
        } else {
            setError(response.message || "Error al aplazar el partido");
        }
        return response;
    }

   function handleAplazarClick(partido) {
     //   if (puedeSuspender(partido)) {
            setError("");
            setSuccess("");
            setPartidoEditando(partido);
    //    } else {
      //      setError("Solo puedes aplazar el partido antes de que empiece");
       //     setSuccess("");
      //  }
    }

    function handleRegistrarClick(partido) {
     //   if (puedeRegistrar(partido)) {
            setError("");
            setSuccess("");
            setPartidoRegistrando({
                ...partido,
                equipo_local_id: partido.equipo_local_id,
                equipo_visitante_id: partido.equipo_visitante_id
            });
            setShowModal(true);
      //  } else {
      //      setError("Solo puedes registrar el partido después de que haya empezado");
       //     setSuccess("");
      //  }
    }

    function renderFechaHora(partido) {
        return (
            <div className="vpa-card-info-row">
                <img
                    src={relojIcon}
                    alt="Reloj"
                    width={18}
                    height={18}
                    style={{ minWidth: 18, minHeight: 18 }}
                />
                <span>
                    {fechaLarga(partido.fecha_partido)}
                    {partido.hora_partido && ` | ${partido.hora_partido.slice(0, 5)}`}
                </span>
            </div>
        );
    }

    function renderUbicacion(partido) {
        return (
            <div className="vpa-card-info-row">
                <img
                    src={estadioIcon}
                    alt="Estadio"
                    width={18}
                    height={18}
                    style={{ minWidth: 18, minHeight: 18 }}
                />
                <span>{partido.ubicacion_estadio}</span>
            </div>
        );
    }

    function renderBotonesAccion(partido) {
        return (
            <div className="vpa-card-botones-bottom-center" style={{ gap: "1rem" }}>
                <button
                    className="vpa-card-boton aplazar"
                    disabled={!puedeSuspender(partido)}
                    title={
                        !puedeSuspender(partido)
                            ? "Solo puedes aplazar antes de que empiece el partido"
                            : ""
                    }
                    onClick={() => handleAplazarClick(partido)}
                >
                    <img
                        src={aplazarPartidoIcon}
                        alt="Aplazar partido"
                        className="vpa-card-boton-icon"
                    />
                    Aplazar partido
                </button>

                <button
                    className="vpa-card-boton registrar"
                    disabled={!puedeRegistrar(partido)}
                    onClick={() => handleRegistrarClick(partido)}
                >
                    <img
                        src={registrarPartidoIcon}
                        alt="Registrar partido"
                        className="vpa-card-boton-icon"
                    />
                    Registrar partido
                </button>
            </div>
        );
    }

    function renderPartido(partido) {
        return (
            <div
                className="vpa-carousel-slide"
                key={`${partido.jornada}-${partido.equipo_local}-${partido.equipo_visitante}`}
            >
                <div className="vpa-card-match">
                    <div className="vpa-card-jornada">Jornada {partido.jornada}</div>

                    <div className="vpa-card-header-escudos">
                        <div className="vpa-card-team">
                            <div className="vpa-escudo-contenedor grande local">
                                <img
                                    src={partido.escudo_local}
                                    alt={`Escudo ${partido.equipo_local}`}
                                    className="vpa-card-escudo-grande"
                                />
                            </div>
                            <span className="vpa-card-rol">Local</span>
                        </div>
                        <div className="vpa-card-vs-grande">VS</div>
                        <div className="vpa-card-team">
                            <div className="vpa-escudo-contenedor grande visitante">
                                <img
                                    src={partido.escudo_visitante}
                                    alt={`Escudo ${partido.equipo_visitante}`}
                                    className="vpa-card-escudo-grande"
                                />
                            </div>
                            <span className="vpa-card-rol">Visitante</span>
                        </div>
                    </div>

                    <div className="vpa-card-content">
                        <div className="vpa-card-info-central" style={{ gap: "0.1rem" }}>
                            {renderFechaHora(partido)}
                            {renderUbicacion(partido)}
                        </div>
                        {renderBotonesAccion(partido)}
                    </div>
                </div>
            </div>
        );
    }


    useEffect(() => {
        async function cargarDatos() {
            const usuario = JSON.parse(sessionStorage.getItem("usuario"));
            if (!usuario?.id_arbitro) {
                setError("No se ha encontrado el árbitro en sesión");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                await cargarPartidos(usuario.id_arbitro);
                const dataEstadios = await equipoService.getEstadios();
                if (Array.isArray(dataEstadios)) {
                    setEstadios(dataEstadios);
                } else {
                    setError("Error al cargar los estadios");
                }
            } catch (err) {
                setError("Error al cargar datos");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        cargarDatos();
        // eslint-disable-next-line 
    }, []);


    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#40c9ff]"></div>
            </div>
        );
    }

    return (
        <>
            <Mensaje
                error={error}
                success={success}
                onClose={() => { setError(""); setSuccess(""); }}
            />
            <div className="vpa-layout">
                <div className="vpa-carrusel-mini">
                    <div className="vpa-carousel-slider">
                        <div
                            className="vpa-carousel-track"
                            style={{ transform: `translateX(-${slide * 100}%)` }}
                        >
                            {partidos.map(renderPartido)}
                        </div>
                    </div>

                    <div className="vpa-carousel-botones">
                        <button
                            className="vpa-carousel-boton-nav"
                            onClick={irPartidoAnterior}
                            disabled={slide === 0}
                        >
                            &larr;
                        </button>
                        <button
                            className="vpa-carousel-boton-nav"
                            onClick={irPartidoSiguiente}
                            disabled={slide === partidos.length - 1}
                        >
                            &rarr;
                        </button>
                    </div>
                </div>

                {partidoEditando && (
                    <AplazarPartidoModal
                        partido={partidoEditando}
                        estadios={estadios}
                        onClose={() => setPartidoEditando(null)}
                        onSave={handleGuardarAplazamiento}
                    />
                )}

                {partidoRegistrando && showModal && (
                    <RegistrarPartidoModal
                        partido={partidoRegistrando}
                        onClose={() => {
                            setShowModal(false);
                            setPartidoRegistrando(null);
                        }}
                        onSave={async (data) => {
                            const res = await partidosService.registrarEstadisticas(partidoRegistrando.id_partido, data);
                            return res;
                        }}
                    />
                )}
            </div>
        </>
    );
}