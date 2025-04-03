
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
}