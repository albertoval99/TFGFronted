import { useOutletContext, useNavigate } from "react-router";
import "./Arbitro.css";
import logoFaf from "/src/assets/logoFaf.png";
import flechaOpcion from "/src/assets/flecha-opcion.svg";

export default function Arbitro() {
    const { usuario } = useOutletContext();
    const navigate = useNavigate();

    const options = [
        { label: "Ver Partidos Asignados", route: "/verPartidosAsignados" },
        { label: "Actualizar Perfil", route: "/actualizarPerfil" },
    ];

    return (
        <div className="w-full h-screen flex items-center justify-center overflow-hidden">
            <div className="arbitro-container">
                <div className="arbitro-rol">Árbitro</div>
                <div className="arbitro-header">
                    <div className="arbitro-left">
                        <img
                            src={logoFaf}
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