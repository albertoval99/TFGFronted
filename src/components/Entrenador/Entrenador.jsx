import { useOutletContext } from "react-router";

export default function Entrenador() {
    const { usuario, setUsuario } = useOutletContext();

    return (
        <>
            <h1>Entrenador: {usuario?.email}</h1>
            <h2>eeeeee</h2>
        </>
    );
}
