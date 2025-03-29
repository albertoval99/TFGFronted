import { useState } from "react";
import { useNavigate } from "react-router";
import { userService } from "../../services/usuarios.service";


export default function Login() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({ email: "", password: "", rol: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setUsuario({ ...usuario, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!usuario.rol) return setError("Por favor, seleccione un rol");
        if (!userService.validarEmail(usuario.email)) return setError("Email no válido");
        if (!userService.validarPassword(usuario.password)) return setError("Contraseña inválida");

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
                        navigate("/jugador");
                        break;
                    default:
                        setError("ERROR,rol incorrecto");
                        return;
                }
            } else {
                setError(response.message || "Error al iniciar sesión");
            }
        } catch {
            setError("Error de conexión");
        }
    };

    return (
        <div className="flex items-center justify-center w-full h-full">
            {/* Contenedor de error */}
            {error && (
                <div className="flex flex-col w-60 sm:w-72 text-[10px] sm:text-xs z-50 fixed bottom-4 right-4">
                    <div className="error-alert cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-lg bg-[#232531] px-[10px]">
                        <div className="flex items-center flex-1">
                            <div className="text-[#d65563] bg-white/5 backdrop-blur-xl p-1 rounded-lg">
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
                            </div>
                            <div className="text-center ml-2.5">
                                <p className="text-white">{error}</p>
                            </div>
                        </div>
                        <button
                            className="text-gray-600 hover:bg-white/10 p-1 rounded-md transition-colors ease-linear"
                            onClick={() => setError('')}
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

            {/* Contenedor principal con la tarjeta de inicio de sesión */}
            <div className="card relative bg-black p-8" style={{ width: "500px", height: "350px" }}>
                <div className="card-content flex flex-col gap-6">
                    <h2 className="heading bg-gradient-to-r from-[#e81cff] to-[#40c9ff] text-transparent bg-clip-text text-center text-2xl font-bold">
                        Iniciar Sesión
                    </h2>

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
                                name="rol"
                                value={usuario.rol}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white"
                            >
                                <option value="">Selecciona tu rol</option>
                                <option value="jugador">Jugador</option>
                                <option value="entrenador">Entrenador</option>
                                <option value="arbitro">Arbitro</option>
                                <option value="administrador">Administrador</option>
                            </select>
                        </div>

                        <div className="button-container">
                            <button type="submit" className="relative group">
                                <div className="relative group">
                                    <div className="relative inline-block font-semibold leading-6 text-white bg-neutral-900 shadow-2xl cursor-pointer rounded-2xl shadow-purple-900 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-purple-600 w-full border border-[#40c9ff]">
                                        <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#CE32FD] to-[#00D8FF] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
                                        <span className="relative z-10 block px-6 py-3 rounded-2xl bg-neutral-950">
                                            <div className="relative z-10 flex items-center space-x-3 justify-center">
                                                <span className="transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-[#CE32FD]">
                                                    Entrar
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