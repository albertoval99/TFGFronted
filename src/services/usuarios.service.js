import jwt_decode from 'jwt-decode'
import { URL } from "./constantes";
import { equipoService } from './equipos.service';
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

            if (!respuesta.ok) {
                return { status: respuesta.status, message: datos.message };
            }

            const token = datos.token;
            sessionStorage.setItem("token", token);

            const decodificado = jwt_decode(token);
            const { id_usuario, email, rol } = decodificado.user;

            // Obtener datos básicos del usuario
            const datosUsuario = await userService.getUserByEmail(email, token);
            if (!datosUsuario) {
                return { status: 404, message: "Usuario no encontrado" };
            }

            // Obtener datos específicos según rol
            let datosRol = null;
            if (rol === "entrenador") {
                datosRol = await userService.getEntrenadorInfo(id_usuario, token);
            } else if (rol === "jugador") {
                datosRol = await userService.getJugadorInfo(id_usuario, token);
            } else if (rol === "arbitro") {
                datosRol = await userService.getArbitroInfo(id_usuario, token);
            }

        
            let usuario = {
                id_usuario,
                email,
                rol,
                ...datosUsuario,
                ...datosRol,
            };

            // Obtener equipo si existe
            const id_equipo = datosRol?.id_equipo || datosUsuario?.id_equipo;
            if (id_equipo) {
                const resultadoEquipo = await equipoService.getEquipoById(id_equipo);
                if (resultadoEquipo.status === 200) {
                    usuario.equipo = resultadoEquipo.equipo;
                } else {
                    console.warn("⚠️ No se pudo obtener el equipo:", resultadoEquipo.message);
                }
            }

            sessionStorage.setItem("usuario", JSON.stringify(usuario));

            return {
                status: 200,
                usuario,
                message: "Inicio de sesión exitoso.\nRedirigiendo al inicio...",
            };
        } catch (error) {
            console.error("❌ Error durante el login:", error);
            return { status: 500, message: "Error de conexión", error };
        }
    },

    getUserByEmail: async (email, token) => {
        try {
            const response = await fetch(`${API_URL}/${email}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) return null;

            const data = await response.json();
            return data; // Devuelve directamente el usuario
        } catch {
            return null;
        }
    },

    getEntrenadorInfo: async (id_usuario, token) => {
        try {
            const response = await fetch(`${API_URL}/entrenador/${id_usuario}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) return null;
            return await response.json();
        } catch {
            return null;
        }
    },

    getJugadorInfo: async (id_usuario, token) => {
        try {
            const response = await fetch(`${API_URL}/jugador/${id_usuario}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) return null;
            return await response.json();
        } catch {
            return null;
        }
    },

    getArbitroInfo: async (id_usuario, token) => {
        try {
            const response = await fetch(`${API_URL}/arbitro/${id_usuario}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (!response.ok) return null;
            return await response.json();
        } catch {
            return null;
        }
    },





    // Función para obtener los datos del usuario directamente del token
    getUser: () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            console.warn("⚠️ No hay usuario o token en sessionStorage");
            return null;
        }
        try {
            const decoded = jwt_decode(token);
            return decoded.user;
        } catch (error) {
            console.error("Error al decodificar el token:", error);
            return null;
        }
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
                return { status: response.status, message: data.message || "Error al crear el entrenador" };
            }
        } catch (error) {
            console.error("❌ Error en la conexión:", error);
            return { status: 500, message: "Error de conexión", error };
        }
    },

    registroJugador: async (jugador) => {
        const user = userService.getUser();

        if (!user) {
            return { status: 401, message: "No autorizado, no se ha encontrado token" };
        }

        try {
            const response = await fetch(`${API_URL}/registroJugador`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify(jugador),
            });

            const data = await response.json();

            if (response.ok) {
                return { status: 201, message: "El jugador ha sido creado con éxito" };
            } else {
                return { status: response.status, message: data.message || "Error al crear el jugador" };
            }
        } catch (error) {
            console.error("❌ Error en la conexión:", error);
            return { status: 500, message: "Error de conexión", error };
        }
    },

    getJugadoresByEquipo: async () => {
        try {
            const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
            const id_equipo = usuario.equipo?.id_equipo;
            if (!usuario) {
                return { status: 401, message: "No hay usuario en sesión" };
            }


            if (!id_equipo) {
                return { status: 404, message: "No se encontró el equipo" };
            }

            const response = await fetch(`${API_URL}/equipo/${id_equipo}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                return { status: 200, jugadores: data };
            } else {
                return { status: response.status, message: data.message };
            }
        } catch (error) {
            console.error("❌ Error al obtener jugadores:", error);
            return { status: 500, message: "Error de conexión", error };
        }
    },


    eliminarJugador: async (id_usuario) => {
        try {

            const response = await fetch(`${API_URL}/${id_usuario}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                return { status: 200, message: "Jugador eliminado con éxito" };
            } else {
                return {
                    status: response.status,
                    message: data.message || "Error al eliminar el jugador"
                };
            }
        } catch (error) {
            console.error("❌ Error al eliminar jugador:", error);
            return { status: 500, message: "Error de conexión", error };
        }
    },

    editarJugador: async (id_jugador, datos) => {
        try {
            const response = await fetch(`${API_URL}/jugador/${id_jugador}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify(datos)
            });

            const data = await response.json();

            if (response.ok) {
                return { status: 200, message: "Jugador actualizado con éxito" };
            } else {
                return {
                    status: response.status,
                    message: data.message || "Error al actualizar el jugador"
                };
            }
        } catch (error) {
            console.error("❌ Error al editar jugador:", error);
            return { status: 500, message: "Error de conexión", error };
        }
    },
};
