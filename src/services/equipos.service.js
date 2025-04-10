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

    getEquipoById: async (id_equipo) => {
        try {
          console.log("Buscando equipo con ID:", id_equipo);
          const token = sessionStorage.getItem("token");
          const respuesta = await fetch(`${API_URL}/${id_equipo}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
      
          const data = await respuesta.json();
      
          if (!respuesta.ok) {
            console.warn("Respuesta no OK:", respuesta.status, data);
            return { status: respuesta.status, message: data.message || "Error al obtener el equipo" };
          }
      
          return { status: 200, equipo: data };
        } catch (error) {
          console.error("Error al obtener info del equipo:", error);
          return { status: 500, message: "Error de conexión", error };
        }
      },
      
    
}