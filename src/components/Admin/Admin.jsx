import { useOutletContext, useNavigate } from "react-router";
import "./Admin.css";
import flechaOpcion from "/src/assets/flecha-opcion.svg";

export default function Admin() {
    const { usuario } = useOutletContext();
    const navigate = useNavigate();

    const options = [
        { label: "Registrar Liga", route: "/registroLiga" },
        { label: "Registrar Equipo", route: "/registroEquipo" },
        { label: "Registrar Árbitro", route: "/registroArbitro" },
        { label: "Registrar Entrenador", route: "/registroEntrenador" },
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
                            <img
                                src={flechaOpcion}
                                alt="Flecha"
                                style={{ width: 28, height: 28 }}
                                aria-hidden="true"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}