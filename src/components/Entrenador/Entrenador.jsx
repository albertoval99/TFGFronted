import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router";
import { ligaService } from "../../services/liga.service";
import "./Entrenador.css";

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
        { label: "Programar Entrenamientos", route: "/crearEntrenamiento" },
        { label: "Ver Entrenamientos Programados", route: "/verEntrenamientos" },
        { label: "Gestionar Plantilla", route: "/gestionarPlantilla" },
        { label: "Gestionar Partidos", route: "/entrenador/calendario" },
    ];

    return (
        <div className="w-full h-screen flex items-center justify-center overflow-hidden">
            <div className="entrenador-container">
                <div className="entrenador-rol">Entrenador</div>

                <div className="entrenador-header">
                    <div className="entrenador-left">
                        {usuario?.equipo?.escudo && (
                            <img
                                src={usuario.equipo.escudo}
                                alt="Escudo del equipo"
                                className="entrenador-escudo"
                            />
                        )}
                        <div className="entrenador-nombre-equipo-wrapper">
                            <h1 className="entrenador-nombre">
                                {usuario.nombre} {usuario.apellidos}
                            </h1>
                            <div className="entrenador-equipo-liga">
                                <span className="entrenador-equipo">
                                    {usuario?.equipo?.nombre_equipo || "Equipo no asignado"}
                                </span>
                                {error ? (
                                    <span className="entrenador-liga-error" style={{ color: "#ef4444" }}>
                                        {error}
                                    </span>
                                ) : ligaInfo ? (
                                    <span className="entrenador-liga">
                                        {ligaInfo.nombre_liga} {ligaInfo.categoria} - {ligaInfo.grupo}
                                    </span>
                                ) : (
                                    <span className="entrenador-liga">Cargando información de la liga...</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="entrenador-botones">
                    {options.map((op) => (
                        <button
                            key={op.route}
                            type="button"
                            onClick={() => navigate(op.route)}
                            className="entrenador-boton"
                        >
                            <span>{op.label}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.25 12H6.75m7.5 0l-3-3m3 3l-3 3"
                                />
                            </svg>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}