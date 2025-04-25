import { useOutletContext, useNavigate } from "react-router";
import "./Admin.css";

export default function Admin() {
    const { usuario } = useOutletContext();
    const navigate = useNavigate();

    const options = [
        { label: "Registrar Árbitro", route: "/registroArbitro" },
        { label: "Registrar Entrenador", route: "/registroEntrenador" },
        { label: "Registrar Liga", route: "/registroLiga" },
        { label: "Registrar Equipo", route: "/registroEquipo" },
        { label: "Gestionar Calendario y Partidos", route: "/admin/registrar-partidos" },
    ];

    return (
        <div className="w-full h-screen flex items-center justify-center overflow-hidden">
            <div className="admin-container">
                <div className="admin-rol">Administrador</div>

                <div className="admin-header">
                    <div className="admin-left">
                        <img
                            src="https://tfg-images-footbalzone.s3.us-east-1.amazonaws.com/logoAdmin.png"
                            alt="Logo Admin"
                            className="admin-logo"
                        />
                        <div className="admin-nombre-wrapper">
                            <h1 className="admin-nombre">
                                {usuario.nombre} {usuario.apellidos}
                            </h1>
                            <div className="admin-email">
                                <span>{usuario.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-botones">
                    {options.map((op) => (
                        <button
                            key={op.route}
                            type="button"
                            onClick={() => navigate(op.route)}
                            className="admin-boton"
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