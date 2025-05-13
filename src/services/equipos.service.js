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
      const token = sessionStorage.getItem("token");
      const respuesta = await fetch(`${API_URL}/${id_equipo}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await respuesta.json();
      console.log("Respuesta del equipo", data);

      if (!respuesta.ok) {
        return { status: respuesta.status, message: data.message || "Error al obtener el equipo" };
      }

      return { status: 200, equipo: data };
    } catch (error) {
      console.error("Error al obtener info del equipo:", error);
      return { status: 500, message: "Error de conexión", error };
    }
  },

  registrarEquipo: async (equipoData) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API_URL}/registroEquipo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(equipoData),
      });

      const data = await response.json();

      return {
        status: response.status,
        message: data.message,
        equipo: data.equipo,
      };
    } catch (error) {
      console.error("Error al registrar equipo:", error);
      throw error;
    }
  },
  getEstadios: async () => {
    try {
      const response = await fetch(`${API_URL}/estadios/getEstadios`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        throw new Error(data.message || "Error al obtener estadios");
      }
    } catch (error) {
      console.error("Error al obtener estadios:", error);
      throw error;
    }
  },
  getJugadoresByEquipo: async (idEquipo) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API_URL}/${idEquipo}/jugadores`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return {
          status: 200,
          jugadores: data.map(j => ({
            id_jugador: j.id_jugador,
            nombre: j.nombre,
            apellidos: j.apellidos,
            dorsal: j.numero_camiseta
          }))
        };
      } else {
        return {
          status: response.status,
          message: data.message || "Error al obtener jugadores"
        };
      }
    } catch (error) {
      console.error("Error al obtener jugadores del equipo:", error);
      return {
        status: 500,
        message: "Error de conexión",
        error
      };
    }
  },



}