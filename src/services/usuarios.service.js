import jwt_decode from 'jwt-decode'
import { URL } from "./constantes";
const API_URL = `${URL}/usuarios`;

export const userService = {
    login: async (credenciales) => {
        try {
            const respuesta = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credenciales),
            });

            const datos = await respuesta.json();

            if (respuesta.ok) {
                // Guardamos el token en sessionStorage
                const token = datos.token;
                sessionStorage.setItem("token", token);

                // Decodificamos el token para obtener el email del usuario y el id_usuario
                const decodificado = jwt_decode(token);
                const emailUsuario = decodificado.user.email;
                const idUsuario = decodificado.user.id_usuario;  // Verifica si se está obteniendo el id_usuario

                console.log("Email del usuario:", emailUsuario);
                console.log("ID del usuario:", idUsuario); // Verifica si está presente

                // Obtenemos los datos completos del usuario mediante una petición extra
                const respuestaUsuario = await fetch(`${API_URL}/${idUsuario}`, {
                    headers: {
                        method: "GET",
                        "Content-Type": "application/json"
                    },
                });
                const datosUsuario = await respuestaUsuario.json();

                if (respuestaUsuario.ok) {
                    // Guardamos los datos completos del usuario en sessionStorage
                    sessionStorage.setItem("usuario", JSON.stringify(datosUsuario));
                    return { estado: 200, usuario: datosUsuario };
                }
                return { estado: respuestaUsuario.status, mensaje: datosUsuario.mensaje };
            }
            return { estado: respuesta.status, mensaje: datos.mensaje };
        } catch (error) {
            return { estado: 500, mensaje: "Error de conexión", error };
        }
    },


    // Función para obtener los datos del usuario directamente del token
    getUser: () => {
        const token = sessionStorage.getItem("token");
        const user = sessionStorage.getItem("usuario");

        if (!token || !user) {
            console.warn("⚠️ No hay usuario o token en sessionStorage");
            return null;
        }

        return {
            token,
            usuario: JSON.parse(user),
        };
    },



    getUsuarios: async () => {
        try {
            const response = await fetch(`${API_URL}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,
                }
            });
            const data = await response.json();
            if (response.ok) {
                return { status: 200, usuarios: data.usuarios };
            } else {
                return { status: response.status, message: data.message };
            }
        } catch (error) {
            return { status: 500, message: "Error de conexión", error };
        }
    },

    validarEmail: (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
    validarPassword: (password) => password.length >= 8,

    logout: () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("usuario");
    },

    registroArbitro: async (arbitro) => {
        const user = userService.getUser();

        if (!user) {
            return { status: 401, message: "No autorizado, no se ha encontrado token" };
        }

        try {
            const response = await fetch(`${API_URL}/registroArbitro`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify(arbitro),
            });

            const data = await response.json();

            if (response.ok) {
                return { status: 201, message: "El arbitro ha sido creado con éxito" };
            } else {
                return { status: response.status, message: data.message || "Error al crear el árbitro" };
            }
        } catch (error) {
            console.error("❌ Error en la conexión:", error);
            return { status: 500, message: "Error de conexión", error };
        }
    },

    registroEntrenador: async (entrenador) => {
        const user = userService.getUser();

        if (!user) {
            return { status: 401, message: "No autorizado, no se ha encontrado token" };
        }

        try {
            const response = await fetch(`${API_URL}/registroEntrenador`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify(entrenador),
            });

            const data = await response.json();

            if (response.ok) {
                return { status: 201, message: "El entrenador ha sido creado con éxito" };
            } else {
                return { status: response.status, message: data.message || "Error al crear el árbitro" };
            }
        } catch (error) {
            console.error("❌ Error en la conexión:", error);
            return { status: 500, message: "Error de conexión", error };
        }
    },

    getUserByEmail: async (email) => {
        try {
            const response = await fetch(`${API_URL}/${email}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                return { status: 200, usuario: data };
            } else {
                return { status: response.status, message: data.message };
            }
        } catch (error) {
            return { status: 500, message: "Error de conexión", error };
        }
    },






};
