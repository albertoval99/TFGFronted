import { useOutletContext, useNavigate } from "react-router";

export default function Admin() {
    const { usuario } = useOutletContext();
    const navigate = useNavigate();

    const options = [
        { label: "Registrar Árbitro", route: "/registroArbitro" },
        { label: "Registrar Entrenador", route: "/registroEntrenador" },
        { label: "Registrar Liga", route: "/registroLiga" },
        { label: "Registrar Equipo", route: "/admin/registrar-equipo" },
        { label: "Registrar Partidos", route: "/admin/registrar-partidos" },
    ];

    return (
        <div className="w-full h-screen flex items-center justify-center overflow-hidden">
            <div
                className="relative flex flex-col items-center justify-center bg-black/90 rounded-2xl shadow-2xl mx-2"
                style={{
                    width: "100%",
                    maxWidth: "700px",
                    boxShadow: "0 0 40px 0 #a855f7, 0 0 0 1px #40c9ff"
                }}
            >
                <h2
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 mt-6 sm:mb-6 sm:mt-8 px-2"
                    style={{
                        background: "linear-gradient(90deg, #e81cff 0%, #40c9ff 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        letterSpacing: "1px"
                    }}
                >
                    Administrador: {usuario.email}
                </h2>
                <div className="w-full flex flex-col gap-3 px-2 sm:px-8 pb-4 sm:pb-8">
                    {options.map((op) => (
                        <button
                            key={op.route}
                            type="button"
                            onClick={() => navigate(op.route)}
                            className="flex items-center justify-between w-full px-3 sm:px-8 py-2 sm:py-3 bg-neutral-900 border border-[#40c9ff] rounded-xl font-semibold text-white text-base sm:text-lg shadow-md transition-all duration-200 hover:scale-105 hover:border-[#e81cff] focus:outline-none"
                            style={{
                                minHeight: "40px"
                            }}
                        >
                            <span>{op.label}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5 sm:w-6 sm:h-6 text-[#40c9ff] group-hover:text-[#e81cff] transition-colors"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 12H6.75m7.5 0l-3-3m3 3l-3 3" />
                            </svg>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}