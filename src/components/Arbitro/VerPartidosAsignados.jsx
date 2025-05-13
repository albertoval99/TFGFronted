import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { partidosService } from "../../services/partidos.service";
import "./Arbitro.css";
import aplazarPartidoIcon from "/src/assets/aplazarPartido.svg";
import registrarPartidoIcon from "/src/assets/registrarPartido.svg";
import AplazarPartidoModal from "./AplazarPartidoModal";

export default function VerPartidosAsignados() {
    const [partidos, setPartidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const [slide, setSlide] = useState(0);
    const navigate = useNavigate();
    const [partidoEditando, setPartidoEditando] = useState(null);

    useEffect(() => {
        const usuario = JSON.parse(sessionStorage.getItem("usuario"));
        if (!usuario?.id_arbitro) {
            setError("No se ha encontrado el árbitro en sesión");
            setLoading(false);
            return;
        }
        cargarPartidos(usuario.id_arbitro);
    }, []);

    const cargarPartidos = async (idArbitro) => {
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
                    let fecha;
                    if (p.fecha_partido.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
                        const [day, month, year] = p.fecha_partido.split("/");
                        fecha = new Date(Number(year), Number(month) - 1, Number(day));
                    } else if (p.fecha_partido.match(/^\d{4}-\d{2}-\d{2}$/)) {
                        const [year, month, day] = p.fecha_partido.split("-");
                        fecha = new Date(Number(year), Number(month) - 1, Number(day));
                    } else {
                        fecha = new Date(p.fecha_partido);
                    }
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
    };

    const fechaLarga = (fechaStr) => {
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
    };

    function puedeSuspender(partido) {
        let fechaPartido;
        if (partido.fecha_partido.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const [day, month, year] = partido.fecha_partido.split("/");
            fechaPartido = new Date(Number(year), Number(month) - 1, Number(day));
        } else if (partido.fecha_partido.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = partido.fecha_partido.split("-");
            fechaPartido = new Date(Number(year), Number(month) - 1, Number(day));
        } else {
            fechaPartido = new Date(partido.fecha_partido);
        }
        if (partido.hora_partido) {
            const [h, m] = partido.hora_partido.split(":");
            fechaPartido.setHours(Number(h), Number(m), 0, 0);
        } else {
            fechaPartido.setHours(0, 0, 0, 0);
        }
        const ahora = new Date();
        return ahora < fechaPartido;
    }

    function puedeRegistrar(partido) {
        let fechaPartido;
        if (partido.fecha_partido.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const [day, month, year] = partido.fecha_partido.split("/");
            fechaPartido = new Date(Number(year), Number(month) - 1, Number(day));
        } else if (partido.fecha_partido.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const [year, month, day] = partido.fecha_partido.split("-");
            fechaPartido = new Date(Number(year), Number(month) - 1, Number(day));
        } else {
            fechaPartido = new Date(partido.fecha_partido);
        }
        if (partido.hora_partido) {
            const [h, m] = partido.hora_partido.split(":");
            fechaPartido.setHours(Number(h), Number(m), 0, 0);
        } else {
            fechaPartido.setHours(0, 0, 0, 0);
        }
        const ahora = new Date();
        return ahora >= fechaPartido;
    }

    const prevSlide = () => setSlide((s) => Math.max(0, s - 1));
    const nextSlide = () => setSlide((s) => Math.min(partidos.length - 1, s + 1));

    const handleGuardarAplazamiento = async (datos) => {
        if (!partidoEditando) return;
        const response = await partidosService.aplazarPartido(partidoEditando.id_partido, datos);
        if (response.status === 200) {
            setPartidos((prev) =>
                prev.map((p) =>
                    p.id_partido === partidoEditando.id_partido ? { ...p, ...datos } : p
                )
            );
            setSuccess("Partido aplazado correctamente");
            setTimeout(() => setSuccess(""), 3000);
            setPartidoEditando(null);
        } else {
            setError(response.message || "Error al aplazar el partido");
        }
        return response;
    };

    if (loading) {
        return (
            <div>
                <span>Cargando partidos...</span>
            </div>
        );
    }

    return (
        <>
            {(error || success) && (
                <div className="flex flex-col w-60 sm:w-72 text-[10px] sm:text-xs z-50 fixed bottom-4 right-4">
                    <div
                        className={`cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-lg px-[10px] bg-[#232531]`}
                    >
                        <div className="flex items-center flex-1">
                            <div
                                className={`bg-white/5 backdrop-blur-xl p-1 rounded-lg ${error ? "text-[#d65563]" : "text-green-500"
                                    }`}
                            >
                                {error ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 12.75l6 6 9-13.5"
                                        />
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
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="vpa-layout">
                <div className="vpa-carrusel-mini">
                    <div className="vpa-carousel-slider">
                        <div
                            className="vpa-carousel-track"
                            style={{ transform: `translateX(-${slide * 100}%)` }}
                        >
                            {partidos.map((p) => (
                                <div
                                    className="vpa-carousel-slide"
                                    key={`${p.jornada}-${p.equipo_local}-${p.equipo_visitante}`}
                                >
                                    <div className="vpa-card-match">
                                        <div className="vpa-card-jornada">Jornada {p.jornada}</div>

                                        <div className="vpa-card-header-escudos">
                                            <div className="vpa-card-team">
                                                <div className="vpa-escudo-contenedor grande local">
                                                    <img
                                                        src={p.escudo_local}
                                                        alt={`Escudo ${p.equipo_local}`}
                                                        className="vpa-card-escudo-grande"
                                                    />
                                                </div>
                                                <span className="vpa-card-rol">Local</span>
                                            </div>
                                            <div className="vpa-card-vs-grande">VS</div>
                                            <div className="vpa-card-team">
                                                <div className="vpa-escudo-contenedor grande visitante">
                                                    <img
                                                        src={p.escudo_visitante}
                                                        alt={`Escudo ${p.equipo_visitante}`}
                                                        className="vpa-card-escudo-grande"
                                                    />
                                                </div>
                                                <span className="vpa-card-rol">Visitante</span>
                                            </div>
                                        </div>

                                        <div className="vpa-card-content">
                                            <div
                                                className="vpa-card-info-central"
                                                style={{ gap: "0.1rem" }}
                                            >
                                                <div className="vpa-card-info-row">
                                                    <svg
                                                        width="18"
                                                        height="18"
                                                        fill="none"
                                                        stroke="#40c9ff"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle cx="12" cy="12" r="10" />
                                                        <path strokeLinecap="round" d="M12 6v6l4 2" />
                                                    </svg>
                                                    <span>
                                                        {fechaLarga(p.fecha_partido)}
                                                        {p.hora_partido && ` | ${p.hora_partido.slice(0, 5)}`}
                                                    </span>
                                                </div>
                                                <div className="vpa-card-info-row">
                                                    <svg
                                                        width="18"
                                                        height="18"
                                                        fill="none"
                                                        stroke="#e81cff"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            d="M3 17V7a2 2 0 012-2h14a2 2 0 012 2v10"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <circle cx="12" cy="15" r="3" />
                                                    </svg>
                                                    <span>{p.ubicacion_estadio}</span>
                                                </div>
                                            </div>

                                            <div
                                                className="vpa-card-botones-bottom-center"
                                                style={{ gap: "1rem" }}
                                            >
                                                <button
                                                    className="vpa-card-boton aplazar"
                                                    disabled={!puedeSuspender(p)}
                                                    title={
                                                        !puedeSuspender(p)
                                                            ? "Solo puedes aplazar antes de que empiece el partido"
                                                            : ""
                                                    }
                                                    onClick={() => {
                                                        if (puedeSuspender(p)) {
                                                            setError("");
                                                            setSuccess("");
                                                            setPartidoEditando(p);
                                                        } else {
                                                            setError(
                                                                "Solo puedes aplazar el partido antes de que empiece"
                                                            );
                                                            setSuccess("");
                                                        }
                                                    }}
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
                                                    disabled={!puedeRegistrar(p)}
                                                    title={
                                                        !puedeRegistrar(p)
                                                            ? "Solo puedes registrar después de que haya empezado el partido"
                                                            : ""
                                                    }
                                                    onClick={() => {
                                                        if (puedeRegistrar(p)) {
                                                            setError("");
                                                            setSuccess("");
                                                            navigate(`/registrarPartido/${p.id_partido}`);
                                                        } else {
                                                            setError(
                                                                "Solo puedes registrar el partido después de que haya empezado"
                                                            );
                                                            setSuccess("");
                                                        }
                                                    }}
                                                >
                                                    <img
                                                        src={registrarPartidoIcon}
                                                        alt="Registrar partido"
                                                        className="vpa-card-boton-icon"
                                                    />
                                                    Registrar partido
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="vpa-carousel-botones">
                        <button
                            className="vpa-carousel-boton-nav"
                            onClick={prevSlide}
                            disabled={slide === 0}
                        >
                            &larr;
                        </button>
                        <button
                            className="vpa-carousel-boton-nav"
                            onClick={nextSlide}
                            disabled={slide === partidos.length - 1}
                        >
                            &rarr;
                        </button>
                    </div>
                </div>
                {partidoEditando && (
                    <AplazarPartidoModal
                        partido={partidoEditando}
                        onClose={() => setPartidoEditando(null)}
                        onSave={handleGuardarAplazamiento}
                    />
                )}
            </div>
        </>
    );
}