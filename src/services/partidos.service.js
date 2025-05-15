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
    },
    getPartidosByArbitro: async (id_arbitro) => {
        try {
            const response = await fetch(`${API_URL}/arbitro/${id_arbitro}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener los partidos del árbitro" };
            }
        } catch (error) {
            return { status: 500, message: "Error de conexión", error };
        }
    },
    aplazarPartido: async (id_partido, datos) => {
        try {
            const response = await fetch(`${API_URL}/${id_partido}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify(datos)
            });

            const data = await response.json();

            if (response.ok) {
                return { status: 200, message: "Partido actualizado con éxito" };
            } else {
                return {
                    status: response.status,
                    message: data.message || "Error al actualizar el partido"
                };
            }
        } catch (error) {
            console.error("❌ Error al aplazar partido:", error);
            return { status: 500, message: "Error de conexión", error };
        }
    },

    registrarEstadisticas: async (idPartido, estadisticas) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${API_URL}/${idPartido}/registrarEstadisticas`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    goles_local: estadisticas.goles_local,
                    goles_visitante: estadisticas.goles_visitante,
                    estadisticas_individuales: estadisticas.estadisticas_individuales
                }),
            });

            const data = await response.json();

            return {
                status: response.status,
                message: data.message,
                data: data
            };
        } catch (error) {
            console.error("Error al registrar estadísticas:", error);
            return {
                status: 500,
                message: "Error de conexión",
                error: error
            };
        }
    },

    getPartidoById: async (id_partido) => {
        try {
            const response = await fetch(`${API_URL}/${id_partido}/estadisticas`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    status: 200,
                    data: data 
                };
            } else {
                return {
                    status: response.status,
                    message: data.message || "Error al obtener el partido"
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