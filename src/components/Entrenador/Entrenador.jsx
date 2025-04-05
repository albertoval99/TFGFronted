import { useOutletContext } from "react-router";

export default function Entrenador() {
    const { usuario } = useOutletContext();
    const idEquipo = usuario?.id_equipo;

    return (
        <>
            <h1>EMAIL Entrenador: {usuario?.email}</h1>
            <h2>ID Equipo: {idEquipo || "No asignado"}</h2>
        </>
    );
}