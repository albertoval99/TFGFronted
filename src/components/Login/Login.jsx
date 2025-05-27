import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { userService } from "../../services/usuarios.service";
import { Mensaje } from "../Error/Mensaje";
import flechaEntrar from "/src/assets/flecha-entrar.svg";

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "", rol: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { setUsuario } = useOutletContext();

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.rol) return setError("Por favor, seleccione un rol");

        try {
            const response = await userService.login(formData);
            if (response.status === 200) {
                setUsuario(response.usuario);
                setError("");
                setSuccess(response.message);
                setTimeout(() => {
                    switch (formData.rol) {
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
                            setError("ERROR, rol incorrecto");
                            break;
                    }
                }, 2000);
            } else {
                setError(response.message);
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
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Contraseña"
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white"
                            />
                        </div>

                        <div>
                            <select
                                name="rol"
                                value={formData.rol}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white"
                            >
                                <option value="">Selecciona tu rol</option>
                                <option value="jugador">Jugador</option>
                                <option value="entrenador">Entrenador</option>
                                <option value="arbitro">Árbitro</option>
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
                                                <img
                                                    src={flechaEntrar}
                                                    alt="Flecha entrar"
                                                    className="w-7 h-7 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-[#00D8FF]"
                                                />
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