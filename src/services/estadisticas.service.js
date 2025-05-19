import { URL } from "./constantes";
const API_URL = `${URL}/estadisticas`;

export const estadisticasService = {

    getEstadisticasJugador: async (id_jugador) => {
        try {
            const response = await fetch(`${API_URL}/jugador/${id_jugador}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    status: 200,
                    data: data.data 
                };
            } else {
                return {
                    status: response.status,
                    message: data.message || "Error al obtener las estadísticas del jugador"
                };
            }
        } catch (error) {
            return {
                status: 500,
                message: "Error de conexión",
                error: error.message
            };
        }
    }
};