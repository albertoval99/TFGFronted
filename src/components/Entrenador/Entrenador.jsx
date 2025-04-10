import { useOutletContext } from "react-router";

export default function Entrenador() {
    const { usuario } = useOutletContext();
    const idEquipo = usuario?.id_equipo;

    return (
        <>
            <h1>EMAIL Entrenador: {usuario.email}</h1>
            <h2>Nombre: {usuario.nombre}</h2>
            <h2>Apellidos: {usuario.apellidos}</h2>
            <h2>ID Equipo: {idEquipo || "No asignado"}</h2>
            <h2>Nombre del equipo: {usuario?.equipo?.nombre_equipo}</h2>
            <h3>Categoría: {usuario?.equipo?.categoria}</h3>

        </>
    );
}