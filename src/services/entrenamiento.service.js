import { URL } from "./constantes";
const API_URL = `${URL}/entrenamientos`;

export const entrenamientoService = {
    crearEntrenamiento: async (entrenamientoData) => {
        try {
            const token = sessionStorage.getItem("token");
            const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
            const id_equipo = usuario.equipo?.id_equipo;

            if (!id_equipo) {
                throw new Error("No se encontró el equipo del usuario");
            }

            const response = await fetch(`${API_URL}/crear`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...entrenamientoData,
                    id_equipo
                }),
            });

            const data = await response.json();

            return {
                status: response.status,
                message: data.message,
                entrenamiento: data.entrenamiento,
            };
        } catch (error) {
            console.error("Error al crear entrenamiento:", error);
            throw error;
        }
    },

    getEntrenamientosEquipo: async () => {
        try {
            const token = sessionStorage.getItem("token");
            const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
            const id_equipo = usuario.equipo?.id_equipo;
            const id_usuario = usuario.id_usuario;

            if (!id_equipo) {
                throw new Error("No se encontró el equipo del usuario");
            }

            // 1. Obtener entrenamientos
            const responseEntrenamientos = await fetch(`${API_URL}/equipo/${id_equipo}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const entrenamientosData = await responseEntrenamientos.json();

            if (!responseEntrenamientos.ok) {
                return {
                    status: responseEntrenamientos.status,
                    message: entrenamientosData.message || "Error al obtener los entrenamientos"
                };
            }

            // 2. Obtener asistencias del jugador
            const responseAsistencias = await fetch(`${API_URL}/asistencias/${id_usuario}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const asistenciasData = await responseAsistencias.json();

            // 3. Combinar entrenamientos con asistencias
            const entrenamientosConAsistencias = entrenamientosData.map(entrenamiento => {
                const asistencia = asistenciasData.asistencias?.find(
                    a => a.id_entrenamiento === entrenamiento.id_entrenamiento
                );
                return {
                    ...entrenamiento,
                    asistio: asistencia ? asistencia.asistio : undefined,
                    justificacion: asistencia ? asistencia.justificacion : undefined
                };
            });

            return {
                status: 200,
                entrenamientos: entrenamientosConAsistencias
            };
        } catch (error) {
            console.error("Error al obtener entrenamientos:", error);
            return { status: 500, message: "Error de conexión", error };
        }
    },

    eliminarEntrenamiento: async (id_entrenamiento) => {
        try {
            const token = sessionStorage.getItem("token");
            const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
            const id_equipo = usuario.equipo?.id_equipo;

            if (!id_equipo) {
                throw new Error("No se encontró el equipo del usuario");
            }

            const response = await fetch(`${API_URL}/${id_entrenamiento}/${id_equipo}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();

            return {
                status: response.status,
                message: data.message,
            };
        } catch (error) {
            console.error("Error al eliminar entrenamiento:", error);
            throw error;
        }
    },

    actualizarAsistencia: async (id_entrenamiento, asistenciaData) => {
        try {
            const token = sessionStorage.getItem("token");
            const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
            const id_jugador = usuario.id_usuario;

            if (!id_jugador) {
                throw new Error("No se encontró el ID del jugador");
            }

            const response = await fetch(`${API_URL}/${id_entrenamiento}/asistencia`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...asistenciaData,
                    id_jugador
                }),
            });

            const data = await response.json();

            return {
                status: response.status,
                message: data.message,
                asistencia: data.asistencia,
            };
        } catch (error) {
            console.error("Error al actualizar asistencia:", error);
            throw error;
        }
    },

    getAsistenciasEntrenamiento: async (id_entrenamiento) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${API_URL}/${id_entrenamiento}/asistencias`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    status: response.status,
                    message: data.message || "Error al obtener las asistencias"
                };
            }

            return { status: 200, asistencias: data };
        } catch (error) {
            console.error("Error al obtener asistencias:", error);
            return { status: 500, message: "Error de conexión", error };
        }
    }
};