import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { userService } from "../../services/usuarios.service";

export default function PerfilUsuario() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        telefono: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const validarEmail = userService.validarEmail;
    const validarTelefono = (telefono) => /^\d{9}$/.test(telefono);

    useEffect(() => {
        const cargarDatosUsuario = async () => {
            const userToken = userService.getUser();
            if (userToken && userToken.id_usuario) {
                setUsuario(userToken);
                setFormData({
                    email: userToken.email || "",
                    telefono: userToken.telefono || "",
                });
            } else {
                setError("No se pudo obtener el ID del usuario del token");
            }
        };
        cargarDatosUsuario();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
        setSuccess("");
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (loading) return;

        if (!validarEmail(formData.email)) {
            setError("El email no es válido");
            return;
        }
        if (formData.telefono && !validarTelefono(formData.telefono)) {
            setError("El teléfono debe tener 9 numeros");
            return;
        }
        if (!usuario) {
            setError("Usuario no cargado");
            return;
        }

        setLoading(true);
        const datosActualizar = {
            id_usuario: usuario.id_usuario,
            email: formData.email,
            telefono: formData.telefono,
        };

        const resultado = await userService.actualizarUsuario(datosActualizar);
        setLoading(false);

        if (resultado.status === 200) {
            setSuccess("Perfil actualizado con éxito");
            const usuarioActualizado = {
                ...usuario,
                email: formData.email,
                telefono: formData.telefono,
            };
            sessionStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
            setUsuario(usuarioActualizado);

            setTimeout(() => {
                switch (usuario.rol) {
                    case "entrenador":
                        navigate("/entrenador");
                        break;
                    case "jugador":
                        navigate("/jugador");
                        break;
                    case "arbitro":
                        navigate("/arbitro");
                        break;
                }
            }, 2000);
        } else {
            setError(`Error al actualizar el perfil: ${resultado.message}`);
        }
    }

    if (!usuario) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
                Cargando datos del usuario...
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center w-full h-full min-h-screen">
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
                                <p className="text-white">
                                    {String(error || success)
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
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div
                className="card relative bg-black p-8"
                style={{ width: "500px", height: "350px" }}
            >
                <div className="card-content flex flex-col gap-6">
                    <h2 className="heading bg-gradient-to-r from-[#e81cff] to-[#40c9ff] text-transparent bg-clip-text text-center text-2xl font-bold">
                        Actualizar Perfil
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-white mb-2 pl-2 pt-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white"
                                placeholder={formData.email}

                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2 pl-2">Teléfono</label>
                            <input
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white"
                                placeholder="Nuevo telefono..."
                            />
                        </div>

                        <div className="button-container">
                            <button
                                type="submit"
                                className="relative group w-full"
                                disabled={loading}
                            >
                                <div className="relative inline-block font-semibold leading-6 text-white bg-neutral-900 shadow-2xl cursor-pointer rounded-2xl shadow-purple-900 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-purple-600 px-6 py-3 border border-[#40c9ff]">
                                    <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#CE32FD] to-[#00D8FF] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                                    <span className="relative z-10 flex items-center justify-center space-x-3">
                                        <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-[#CE32FD]">
                                            {loading ? "Actualizando..." : "Actualizar Perfil"}
                                        </span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-[#00D8FF]"
                                        >
                                            <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path>
                                        </svg>
                                    </span>
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}