import { useState } from "react";
import { useNavigate } from "react-router";
import { userService } from "../../services/usuarios.service";
import "./login.css";

export default function Login() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({
        email: "",
        password: "",
        userType: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario((prev) => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!usuario.userType) {
            setError("Por favor, seleccione un rol");
            setLoading(false);
            return;
        }

        if (!userService.validarEmail(usuario.email)) {
            setError("El formato del email no es válido");
            setLoading(false);
            return;
        }

        if (!userService.validarPassword(usuario.password)) {
            setError("La contraseña debe tener al menos 8 caracteres");
            setLoading(false);
            return;
        }

        try {
            const response = await userService.login(usuario);
            if (response.status === 200) {
                const user = userService.getUser();
                switch (user?.rol) {
                    case "administrador":
                        navigate("/admin");
                        break;
                    case "entrenador":
                        navigate("/entrenador");
                        break;
                    case "arbitro":
                        navigate("/arbitro");
                        break;
                    case "jugador":
                        navigate("/dashboard");
                        break;
                    default:
                        navigate("/dashboard");
                }
            } else {
                setError(response.message || "Error al iniciar sesión");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
            console.log(err)
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="card relative w-[900px] h-[600px] bg-black p-8">
                <div className="card-content flex flex-col gap-6">
                    <h2 className="heading bg-gradient-to-r from-[#e81cff] to-[#40c9ff] text-transparent bg-clip-text text-center text-2xl font-bold">
                        Iniciar Sesión
                    </h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="email"
                                name="email"
                                value={usuario.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                name="password"
                                value={usuario.password}
                                onChange={handleChange}
                                placeholder="Contraseña"
                                className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white"
                            />
                        </div>

                        <div>
                            <select
                                name="userType"
                                value={usuario.userType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white"
                            >
                                <option value="">Seleccione un rol</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Entrenador">Entrenador</option>
                                <option value="Arbitro">Arbitro</option>
                                <option value="Jugador">Jugador</option>
                            </select>
                        </div>

                        <div className="button-container">
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative group w-full"
                            >
                                <div className="relative group">
                                    <div className="relative inline-block p-px font-semibold leading-6 text-white bg-neutral-900 shadow-2xl cursor-pointer rounded-2xl shadow-purple-900 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-purple-600 w-full">
                                        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#CE32FD] to-[#00D8FF] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                                        <span className="relative z-10 block px-6 py-3 rounded-2xl bg-neutral-950">
                                            <div className="relative z-10 flex items-center space-x-3">
                                                <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-[#CE32FD]">
                                                    {loading ? "Cargando..." : "Entrar"}
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
