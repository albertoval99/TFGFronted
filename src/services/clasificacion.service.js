import { URL } from "./constantes";
const API_URL = `${URL}/clasificacion`;

export const clasificacionService = {

    obtenerClasificacion: async (id_liga) => {

        try {
            const response = await fetch(`${API_URL}/${id_liga}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                return data;
            } else {
                throw new Error(data.message || "Error al obtener clasificacion");
            }
        } catch (error) {
            console.error("Error al obtener la clasificacion:", error);
            throw error;
        }
    }
}