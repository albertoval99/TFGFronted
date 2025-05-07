import { URL } from "./constantes";
const API_URL = `${URL}/partidos`;

export const partidosService = {
    getPartidosByJornada: async (id_liga, jornada) => {
        try {
            const response = await fetch(`${API_URL}/ligas/${id_liga}/jornada/${jornada}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener la jornada" };
            }
        } catch (error) {
            return { status: 500, message: "Error de conexión", error };
        }
    },
    getPartidosByEquipo: async (id_equipo) => {
        try {
            const response = await fetch(`${API_URL}/equipos/${id_equipo}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener los partidos del equipo" };
            }
        } catch (error) {
            return { status: 500, message: "Error de conexión", error };
        }
    }
};