import { URL } from "./constantes";
const API_URL = `${URL}/partidos/alineaciones`;

export const alineacionesService = {
    getAlineacionesByPartido: async (id_partido) => {
        try {
            const response = await fetch(`${API_URL}/partido/${id_partido}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok) {
                return { status: 200, alineaciones: data.data };
            } else {
                return { status: response.status, message: data.message || "Error al obtener las alineaciones" };
            }
        } catch (error) {
            console.error("❌ Error al obtener las alineaciones:", error);
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },

    registrarAlineacion: async (alineacion) => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                return { status: 401, message: "No autorizado, no se ha encontrado token" };
            }

            const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
            const id_equipo = usuario.equipo?.id_equipo;

            if (!id_equipo) {
                return { status: 400, message: "No se encontró el equipo del usuario" };
            }

            const alineacionCompleta = {
                ...alineacion,
                id_equipo: alineacion.id_equipo || id_equipo
            };

            const response = await fetch(`${API_URL}/registro`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(alineacionCompleta),
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    status: 201,
                    message: data.message || "Alineación registrada correctamente",
                    alineacion: data.data
                };
            } else {
                return {
                    status: response.status,
                    message: data.message || "Error al registrar alineación"
                };
            }
        } catch (error) {
            console.error("❌ Error al registrar alineación:", error);
            return { status: 500, message: "Error de conexión", error: error.message };
        }
    },
};