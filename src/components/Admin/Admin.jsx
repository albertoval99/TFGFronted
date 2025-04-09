import { useOutletContext } from "react-router";

export default function Admin() {
    const { usuario } = useOutletContext();

    return (
        <>
            <h1>Admin: {usuario.email}</h1>
            <h2>Nombre: {usuario.nombre}</h2>
            <h2>Apellidos: {usuario.apellidos}</h2>
        </>
    );
}
