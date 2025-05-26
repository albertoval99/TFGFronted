import { useState } from "react";
import { useNavigate } from "react-router";
import { entrenamientoService } from "../../services/entrenamiento.service";
import { Mensaje } from "../Error/Mensaje";

export default function CrearEntrenamiento() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fecha_hora_entrenamiento: "",
        duracion: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fecha_hora_entrenamiento || !formData.duracion) {
            return setError("Por favor, complete todos los campos");
        }

        try {
            const response = await entrenamientoService.crearEntrenamiento(formData);
            if (response.status === 201) {
                setError("");
                setSuccess(response.message);
                setTimeout(() => {
                    navigate("/verEntrenamientos");
                }, 2000);
            } else {
                setError(response.message || "Error al crear el entrenamiento");
            }
        } catch {
            setError("Error de conexión");
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-full">
            <Mensaje
                error={error}
                success={success}
                onClose={() => { setError(""); setSuccess(""); }}
            />

            {/* Formulario */}
            <div className="card relative bg-black p-8" style={{ width: "500px", height: "350px" }}>
                <div className="card-content flex flex-col gap-6">
                    <h2 className="heading bg-gradient-to-r from-[#e81cff] to-[#40c9ff] text-transparent bg-clip-text text-center text-2xl font-bold">
                        Crear Entrenamiento
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-white mb-2 pl-2 pt-2">Fecha y hora</label>
                            <input
                                type="datetime-local"
                                name="fecha_hora_entrenamiento"
                                value={formData.fecha_hora_entrenamiento}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2 pl-2">Duración</label>
                            <input
                                type="text"
                                name="duracion"
                                value={formData.duracion}
                                onChange={handleChange}
                                placeholder="(ej: 90 minutos)"
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white"
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
                                                    Crear Entrenamiento
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