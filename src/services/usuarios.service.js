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
            const token = datos.token;
            sessionStorage.setItem("token", token);
            const decodificado = jwt_decode(token);
            const { id_usuario, email, rol } = decodificado.user;
            let usuario = { id_usuario, email, rol };
            
            if (rol === "entrenador") {
              const respuestaEntrenador = await fetch(`${API_URL}/entrenador/${id_usuario}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              });
              const datosEntrenador = await respuestaEntrenador.json();
              if (respuestaEntrenador.ok) {
                usuario = { ...usuario, ...datosEntrenador };
              } else {
                return { status: respuestaEntrenador.status, message: datosEntrenador.message };
              }
            }
            
            sessionStorage.setItem("usuario", JSON.stringify(usuario));
            return {
              status: 200,
              usuario,
              message: "Inicio de sesión exitoso.\nRedirigiendo al inicio...",
            };
          }
          
          return { status: respuesta.status, message: datos.message };
        } catch (error) {
          console.error("❌ Error durante el login:", error);
          return { status: 500, message: "Error de conexión", error };
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

    // Función para obtener los datos del entrenador(equipo,id entrenador x el id del ususario)
    getEntrenadorInfo: async (id_usuario) => {
        try {
            const respuesta = await fetch(`${API_URL}/entrenador/${id_usuario}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!respuesta.ok) {
                throw new Error("No se pudo obtener la información del entrenador");
            }
            return await respuesta.json();
        } catch (error) {
            console.error("Error al obtener info de entrenador:", error);
            return null;
        }
    }






};
