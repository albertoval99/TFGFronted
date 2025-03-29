import { URL } from "./constantes";
const API_URL = `${URL}/usuarios`;


export const userService = {
    // Login de usuario
    login: async (credentials) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });
            
            const data = await response.json();
            data.status = response.status;

            if (data.status === 200) {
                localStorage.setItem("user", JSON.stringify(data.result.user));
                localStorage.setItem("token", data.result.token);
            }

            return data;
        } catch (error) {
            return {
                status: 500,
                message: "Error de conexión",
                error: error
            };
        }
    },

    // Obtener usuario actual
    getUser: () => {
        try {
            const user = localStorage.getItem("user");
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("Error al obtener usuario:", error);
            return null;
        }
    },

    // Validar email
    validarEmail: (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    },

    // Validar contraseña
    validarPassword: (password) => {
        return password.length >= 8;
    },

    getUsuarios: async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(API_URL, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Si tu endpoint requiere autenticación, incluye el token:
              "Authorization": `Bearer ${token}`,
            },
          });
          const data = await response.json();
          data.status = response.status;
          return data;
        } catch (error) {
          return {
            status: 500,
            message: "Error de conexión",
            error: error,
          };
        }
      },
};
