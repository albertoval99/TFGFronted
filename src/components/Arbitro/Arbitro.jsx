import { useOutletContext, useNavigate } from "react-router";
import "./Arbitro.css";

export default function Arbitro() {
    const { usuario } = useOutletContext();
    const navigate = useNavigate();

    const options = [
        { label: "Ver Partidos Asignados", route: "/verPartidosAsignados" },
        { label: "Actualizar Perfil", route: "/arbitro/calendario" },
    ];

    return (
        <div className="w-full h-screen flex items-center justify-center overflow-hidden">
            <div className="arbitro-container">
                <div className="arbitro-rol">Árbitro</div>

                <div className="arbitro-header">
                    <div className="arbitro-left">
                        <img
                            src="https://tfg-images-footbalzone.s3.us-east-1.amazonaws.com/logo(ffaragon).png"
                            alt="Logo FFAR"
                            className="arbitro-logo"
                        />
                        <div className="arbitro-nombre-wrapper">
                            <h1 className="arbitro-nombre">
                                {usuario.nombre} {usuario.apellidos}
                            </h1>
                            <div className="arbitro-federacion">
                                <span>Federación Aragonesa de Fútbol</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="arbitro-botones">
                    {options.map((op) => (
                        <button
                            key={op.route}
                            type="button"
                            onClick={() => navigate(op.route)}
                            className="arbitro-boton"
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