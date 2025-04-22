import { useState } from "react";
import { useNavigate } from "react-router";
import { ligaService } from "../../services/liga.service";

export default function RegistroLiga() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre_liga: "",
        categoria: "",
        grupo: "",
        temporada: "",
        descripcion: ""
    });
    const [error, setError] = useState(""); 
    const [success, setSuccess] = useState(""); 

    function handlerOnChange(e) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nombre_liga || !formData.categoria || !formData.grupo || !formData.temporada) {
            setError("Por favor, rellena todos los campos obligatorios.");
            return;
        }

        try {
            const result = await ligaService.registrarLiga(formData);

            if (result.status === 201) {
                setError("");
                setSuccess(result.message || "La liga ha sido registrada con éxito. Redirigiendo al inicio...");

                setTimeout(() => {
                    navigate("/admin");
                }, 2000);

                setFormData({
                    nombre_liga: "",
                    categoria: "",
                    grupo: "",
                    temporada: "",
                    descripcion: ""
                });
            } else {
                setError(result.message);
            }
        } catch (error) {
            setError("Error de conexión. Intenta de nuevo más tarde.");
            console.log("Error de conexión. Intenta de nuevo más tarde.", error);
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-full">
            {/* Contenedor de mensajes (error o éxito) */}
            {(error || success) && (
                <div className="flex flex-col w-60 sm:w-72 text-[10px] sm:text-xs z-50 fixed bottom-4 right-4">
                    <div
                        className={`cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-lg px-[10px] ${error ? "bg-[#232531]" : "bg-[#232531]"
                            }`}
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
                                        ></path>
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
                                        ></path>
                                    </svg>
                                )}
                            </div>
                            <div className="text-center ml-2.5">
                                <p className="text-white">
                                    {(error || success)
                                        .split("\n")
                                        .map((line, index) => (
                                            <span key={index}>
                                                {line}
                                                <br />
                                            </span>
                                        ))}
                                </p>
                            </div>
                        </div>
                        <button
                            className="text-gray-600 hover:bg-white/10 p-1 rounded-md transition-colors ease-linear"
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
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Tarjeta de registro para ligas */}
            <div className="card relative bg-black p-8" style={{ width: "500px", minHeight: "450px" }}>
                <div className="card-content flex flex-col gap-6">
                    <h2 className="heading bg-gradient-to-r from-[#e81cff] to-[#40c9ff] text-transparent bg-clip-text text-center text-2xl font-bold leading-[1.2] pb-2 overflow-visible">
                        Registro de Liga
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="text"
                                name="nombre_liga"
                                placeholder="Nombre de la liga"
                                value={formData.nombre_liga}
                                onChange={handlerOnChange}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="categoria"
                                placeholder="Categoría"
                                value={formData.categoria}
                                onChange={handlerOnChange}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="grupo"
                                placeholder="Grupo"
                                value={formData.grupo}
                                onChange={handlerOnChange}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                name="temporada"
                                placeholder="Temporada"
                                value={formData.temporada}
                                onChange={handlerOnChange}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white"
                            />
                        </div>
                        <div>
                            <textarea
                                name="descripcion"
                                placeholder="Descripción (opcional)"
                                value={formData.descripcion}
                                onChange={handlerOnChange}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white resize-none"
                                rows={3}
                            />
                        </div>
                        <div className="button-container">
                            <button type="submit" className="relative group">
                                <div className="relative group">
                                    <div className="relative inline-block font-semibold leading-6 text-white bg-neutral-900 shadow-2xl cursor-pointer rounded-2xl shadow-purple-900 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-purple-600 w-full border border-[#40c9ff]">
                                        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#CE32FD] to-[#00D8FF] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                                        <span className="relative z-10 block px-6 py-3 rounded-2xl bg-neutral-950">
                                            <div className="relative z-10 flex items-center space-x-3 justify-center">
                                                <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-[#CE32FD]">
                                                    Registrar
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    className="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-[#00D8FF]"
                                                >
                                                    <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
                                                </svg>
                                            </div>
                                        </span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}