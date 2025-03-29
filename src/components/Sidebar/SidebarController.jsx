import { useState, useEffect } from "react";
import { userService } from "./userService";
import SideBar from "./Sidebar";
import SideBarAdmin from "./SidebarAdmin";

export default function SideBarController() {
    const [rol, setRol] = useState(null); // Estado para almacenar el rol
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        // Obtén el usuario desde el token
        const user = userService.getUser();

        // Verificar si user tiene la propiedad `user` y el `rol` dentro de ella
        if (user && user.user && user.user.rol) {
            console.log("Rol encontrado:", user.user.rol); // Verifica si el rol está en el objeto
            setRol(user.user.rol); // Almacena el rol en el estado
        } else {
            console.log("No se encontró rol en el token.");
        }

        // Cambia el estado de carga a false una vez se obtenga el rol
        setLoading(false);
    }, []); // Este efecto solo se ejecuta al montar el componente

    // Si el componente está en estado de carga, muestra un mensaje temporal
    if (loading) {
        return <div>Cargando...</div>;
    }

    // Verifica si el rol es 'administrador', si es así, muestra SideBarAdmin
    if (rol === "administrador") {
        return <SideBarAdmin />;
    }

    // Si el rol no es 'administrador', muestra el SideBar general
    return <SideBar />;
}
