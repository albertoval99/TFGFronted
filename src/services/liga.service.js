import { userService } from "./usuarios.service";
import { URL } from "./constantes";
const API_URL = `${URL}/ligas`;


export const ligaService = {
    registrarLiga: async (liga) => {
        const user = userService.getUser();

        if (!user) {
            return { status: 401, message: "No autorizado, no se ha encontrado token" };
        }

        try {
            const response = await fetch(`${API_URL}/registroLiga`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify(liga),
            });

            const data = await response.json();

            if (response.ok) {
                return { status: 201, message: "La liga ha sido creada con éxito" };
            } else {
                return { status: response.status, message: data.message || "Error al crear la liga" };
            }
        } catch (error) {
            console.error("❌ Error en la conexión:", error);
            return { status: 500, message: "Error de conexión", error };
        }
    },

    getLigas: async () => {
        try {
            const response = await fetch(`${API_URL}/getLigas`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (response.ok) {
                return data;
            } else {
                throw new Error(data.message || "Error al obtener ligas");
            }
        } catch (error) {
            console.error("Error al obtener ligas:", error);
            throw error;
        }
    },

    getLigaById: async (id_liga) => {
        try {
            const token = sessionStorage.getItem("token");
            const respuesta = await fetch(`${API_URL}/${id_liga}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                return {
                    status: respuesta.status,
                    message: data.message || "Error al obtener la liga"
                };
            }

            return { status: 200, liga: data };
        } catch (error) {
            console.error("Error al obtener info de la liga:", error);
            return {
                status: 500,
                message: "Error de conexión",
                error
            };
        }
    },
};