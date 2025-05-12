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
                return data;
            } else {
                throw new Error(data.message || "Error al obtener las alineaciones");
            }
        } catch (error) {
            console.error("Error al obtener las alineaciones:", error);
            throw error;
        }
    },
    registrarAlineacion: async (alineacion) => {
        try {
            const token = sessionStorage.getItem("token");
            const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
            const id_equipo = usuario.equipo?.id_equipo;

            if (!id_equipo) {
                throw new Error("No se encontró el equipo del usuario");
            }

            const response = await fetch(`${API_URL}/registro`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(alineacion),
            });

            const text = await response.text();
            try {
                const data = JSON.parse(text);
                return {
                    status: response.status,
                    message: data.message,
                    alineacion: data.data,
                };
            } catch {
                throw new Error("Respuesta no es JSON válida: " + text);
            }
        } catch (error) {
            console.error("Error al registrar alineación:", error);
            throw error;
        }
      },
};