import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { userService } from "../../services/usuarios.service";

export default function RegistroJugador() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: "",
        apellidos: "",
        email: "",
        password: "",
        repetirPassword: "",
        id_equipo: "", 
        posicion: "",
        activo: true,
        numero_camiseta: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Obtener id_equipo del usuario en sesión
    useEffect(() => {
        const entrenador = JSON.parse(sessionStorage.getItem("usuario"));
        if (entrenador?.id_equipo) {
            setFormData(prev => ({
                ...prev,
                id_equipo: entrenador.id_equipo
            }));
        }
    }, []);

    function handlerOnChange(e) {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.nombre ||
            !formData.apellidos ||
            !formData.email ||
            !formData.password ||
            !formData.repetirPassword ||
            !formData.posicion ||
            !formData.numero_camiseta
        ) {
            setError("Por favor, rellena todos los campos.");
            return;
        }

        if (formData.password !== formData.repetirPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (!userService.validarEmail(formData.email)) {
            setError("El email no es válido");
            return;
        }

        if (!userService.validarPassword(formData.password)) {
            setError("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        try {
            const result = await userService.registroJugador(formData);

            if (result.status === 201) {
                setError("");
                setSuccess(result.message || "El jugador ha sido registrado con éxito. Redirigiendo al inicio...");

                setTimeout(() => {
                    navigate("/entrenador");
                }, 2000);

                setFormData({
                    nombre: "",
                    apellidos: "",
                    email: "",
                    password: "",
                    repetirPassword: "",
                    id_equipo: "",
                    posicion: "",
                    activo: false,
                    numero_camiseta: ""
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
            {(error || success) && (
                <div className="flex flex-col w-60 sm:w-72 text-[10px] sm:text-xs z-50 fixed bottom-4 right-4">
                    <div className="cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-lg px-2 bg-[#232531]">
                        <div className="flex items-center flex-1">
                            <div className={`bg-white/5 backdrop-blur-xl p-1 rounded-lg ${error ? "text-[#d65563]" : "text-green-500"}`}>
                                {error ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"></path>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="card relative bg-black p-6" style={{ width: "600px", height: "auto" }}>
                <div className="card-content flex flex-col gap-4">
                    <h2 className="heading bg-gradient-to-r from-[#e81cff] to-[#40c9ff] text-transparent bg-clip-text text-center text-2xl font-bold">
                        Registro de Jugadores
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                value={formData.nombre}
                                onChange={handlerOnChange}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white text-sm"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                name="apellidos"
                                placeholder="Apellidos"
                                value={formData.apellidos}
                                onChange={handlerOnChange}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white text-sm"
                            />
                        </div>

                        <div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handlerOnChange}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white text-sm"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handlerOnChange}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white text-sm"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                name="repetirPassword"
                                placeholder="Repetir Password"
                                value={formData.repetirPassword}
                                onChange={handlerOnChange}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white text-sm"
                            />
                        </div>

                        
                        <input
                            type="hidden"
                            name="id_equipo"
                            value={formData.id_equipo}
                        />

                        <div>
                            <input
                                type="text"
                                name="posicion"
                                placeholder="Posición"
                                value={formData.posicion}
                                onChange={handlerOnChange}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white text-sm"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                name="numero_camiseta"
                                placeholder="Dorsal"
                                value={formData.numero_camiseta}
                                onChange={handlerOnChange}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white text-sm"
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="activo"
                                checked={formData.activo}
                                onChange={handlerOnChange}
                                className="mr-2"
                            />
                            <label className="text-white">Jugador Activo</label>
                        </div>

                        <div className="button-container col-span-2">
                            <button type="submit" className="relative group w-full">
                                <div className="relative group">
                                    <div className="relative inline-block font-semibold leading-6 text-white bg-neutral-900 shadow-2xl cursor-pointer rounded-2xl shadow-purple-900 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-purple-600 border border-[#40c9ff]">
                                        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#CE32FD] to-[#00D8FF] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                                        <span className="relative z-10 block px-6 py-2 rounded-2xl bg-neutral-950">
                                            <div className="relative z-10 flex items-center space-x-3 justify-center">
                                                <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-[#CE32FD]">
                                                    Registrar
                                                </span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-[#00D8FF]">
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
