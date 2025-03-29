import jwt_decode from 'jwt-decode'




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
                // Guardamos solo el token en sessionStorage
                sessionStorage.setItem("token", data.token);
                return { status: 200 };
            }
            return { status: response.status, message: data.message };
        } catch {
            return { status: 500, message: "Error de conexión" };
        }
    },
    

    // Función para obtener los datos del usuario directamente del token
    getUser: () => {
        const token = sessionStorage.getItem("token");
        if (token) {
            try {
                // Decodificamos el token
                const decoded = jwt_decode(token);
                console.log("Token decodificado:", decoded); // Verifica la salida del token decodificado
                return decoded;  // Retorna el contenido del token (usuario)
            } catch (error) {
                console.error("Error al decodificar el token", error);
                return null;
            }
        }
        return null;
    },

    getUsuarios: async () => {
        try {
            const response = await fetch(`${API_URL}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionStorage.getItem("token")}`,  // Usamos el token para autorización
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
