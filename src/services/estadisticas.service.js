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
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getMaximoGoleador: async () => {
        try {
            const response = await fetch(`${API_URL}/maximo-goleador`);
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener el máximo goleador" };
            }
        } catch (error) {
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getMaximosGoleadores: async () => {
        try {
            const response = await fetch(`${API_URL}/maximos-goleadores`);
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener los máximos goleadores" };
            }
        } catch (error) {
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getMejorJugador: async () => {
        try {
            const response = await fetch(`${API_URL}/mejor-jugador`);
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener el mejor jugador" };
            }
        } catch (error) {
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getMejoresJugadores: async () => {
        try {
            const response = await fetch(`${API_URL}/mejores-jugadores`);
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener los mejores jugadores" };
            }
        } catch (error) {
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getJugadorMasAmarillas: async () => {
        try {
            const response = await fetch(`${API_URL}/jugador-mas-amarillas`);
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener el jugador con más amarillas" };
            }
        } catch (error) {
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getJugadoresMasAmarillas: async () => {
        try {
            const response = await fetch(`${API_URL}/jugadores-mas-amarillas`);
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener los jugadores con más amarillas" };
            }
        } catch (error) {
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getJugadorMasRojas: async () => {
        try {
            const response = await fetch(`${API_URL}/jugador-mas-rojas`);
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener el jugador con más rojas" };
            }
        } catch (error) {
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getJugadoresMasRojas: async () => {
        try {
            const response = await fetch(`${API_URL}/jugadores-mas-rojas`);
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener los jugadores con más rojas" };
            }
        } catch (error) {
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getJugadorMasTitularidades: async () => {
        try {
            const response = await fetch(`${API_URL}/jugador-mas-titularidades`);
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener el jugador con más titularidades" };
            }
        } catch (error) {
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    getJugadoresMasTitularidades: async () => {
        try {
            const response = await fetch(`${API_URL}/jugadores-mas-titularidades`);
            const data = await response.json();
            if (response.ok) {
                return { status: 200, data: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener los jugadores con más titularidades" };
            }
        } catch (error) {
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    }
};