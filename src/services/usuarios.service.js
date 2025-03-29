import { URL } from "./constantes"; 
const API_URL = `${URL}/usuarios`;

export const userService = {
    login: async (credentials) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
           
            const data = await response.json();
    
            if (response.ok) {
                localStorage.setItem("user", JSON.stringify(data.usuario)); 
                localStorage.setItem("token", data.token); 
                return { status: 200 };
            }
            return { status: response.status, message: data.message };
        } catch {
            return { status: 500, message: "Error de conexión" };
        }
    },

    getUser: () => JSON.parse(localStorage.getItem("user")) || null,

    
    getUsuarios: async () => {
        try {
            const response = await fetch(`${API_URL}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            });

            const data = await response.json();
            if (response.ok) {
                return { status: 200, usuarios: data.usuarios }; 
            } else {
                return { status: response.status, message: data.message };
            }
        } catch {
            return { status: 500, message: "Error de conexión" }; 
        }
    },

    validarEmail: (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
    validarPassword: (password) => password.length >= 8,
};
