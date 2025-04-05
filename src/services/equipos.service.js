
import { URL } from "./constantes";
const API_URL = `${URL}/equipos`;

export const equipoService = {
    getEquipos: async () => {
        try {
            const response = await fetch(`${API_URL}/getEquipos`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.message || "Error al obtener equipos");
            }
        } catch (error) {
            console.error("Error al obtener equipos:", error);
            throw error;
        }
    },

    getEquipoById: async (id_equipo) => {
        try {
            const respuesta = await fetch(`${API_URL}/${id_equipo}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!respuesta.ok) {
                throw new Error("No se pudo obtener la información del equipo");
            }
            return await respuesta.json();
        } catch (error) {
            console.error("Error al obtener info del equipo:", error);
            return null;
        }
    }
    
}