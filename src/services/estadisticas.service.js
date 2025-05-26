import { URL } from "./constantes";
const API_URL = `${URL}/estadisticas`;

export const estadisticasService = {
    getEstadisticasJugador: async (id_jugador) => {
        try {
            const response = await fetch(`${API_URL}/jugador/${id_jugador}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener las estadísticas del jugador" };
            }
        } catch (error) {
            console.error("❌ Error al obtener estadísticas del jugador:", error);
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getMaximoGoleador: async () => {
        try {
            const response = await fetch(`${API_URL}/maximo-goleador`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener el máximo goleador" };
            }
        } catch (error) {
            console.error("❌ Error al obtener máximo goleador:", error);
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getMaximosGoleadores: async () => {
        try {
            const response = await fetch(`${API_URL}/maximos-goleadores`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener los máximos goleadores" };
            }
        } catch (error) {
            console.error("❌ Error al obtener máximos goleadores:", error);
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getMejorJugador: async () => {
        try {
            const response = await fetch(`${API_URL}/mejor-jugador`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener el mejor jugador" };
            }
        } catch (error) {
            console.error("❌ Error al obtener mejor jugador:", error);
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getMejoresJugadores: async () => {
        try {
            const response = await fetch(`${API_URL}/mejores-jugadores`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener los mejores jugadores" };
            }
        } catch (error) {
            console.error("❌ Error al obtener mejores jugadores:", error);
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getJugadorMasAmarillas: async () => {
        try {
            const response = await fetch(`${API_URL}/jugador-mas-amarillas`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener el jugador con más amarillas" };
            }
        } catch (error) {
            console.error("❌ Error al obtener jugador con más amarillas:", error);
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getJugadoresMasAmarillas: async () => {
        try {
            const response = await fetch(`${API_URL}/jugadores-mas-amarillas`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener los jugadores con más amarillas" };
            }
        } catch (error) {
            console.error("❌ Error al obtener jugadores con más amarillas:", error);
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getJugadorMasRojas: async () => {
        try {
            const response = await fetch(`${API_URL}/jugador-mas-rojas`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener el jugador con más rojas" };
            }
        } catch (error) {
            console.error("❌ Error al obtener jugador con más rojas:", error);
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getJugadoresMasRojas: async () => {
        try {
            const response = await fetch(`${API_URL}/jugadores-mas-rojas`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener los jugadores con más rojas" };
            }
        } catch (error) {
            console.error("❌ Error al obtener jugadores con más rojas:", error);
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getJugadorMasTitularidades: async () => {
        try {
            const response = await fetch(`${API_URL}/jugador-mas-titularidades`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener el jugador con más titularidades" };
            }
        } catch (error) {
            console.error("❌ Error al obtener jugador con más titularidades:", error);
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getJugadoresMasTitularidades: async () => {
        try {
            const response = await fetch(`${API_URL}/jugadores-mas-titularidades`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener los jugadores con más titularidades" };
            }
        } catch (error) {
            console.error("❌ Error al obtener jugadores con más titularidades:", error);
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    }
};