import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import { userService } from "../../services/usuarios.service";

export default function Entrenador() {
    const { usuario } = useOutletContext();
    const [idEquipo, setIdEquipo] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            if (usuario?.email) {
                const result = await userService.getUserByEmail(usuario.email);
                console.log(result);
                if (result.status === 200 && result.usuario) {
                    setIdEquipo(result.usuario.id_equipo); // Ajusta esto según la respuesta del backend
                    
                }
            }
        }
        fetchUser();
    }, [usuario]);

    return (
        <>
            <h1>Entrenador: {usuario?.email}</h1>
            <h2>Equipo: {idEquipo || "No asignado"}</h2>
        </>
    );
}