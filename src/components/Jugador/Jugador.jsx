import { useOutletContext } from "react-router";

export default function Jugador() {
    const { usuario, setUsuario } = useOutletContext();

    return (
        <>
            <h1>Jugador: {usuario?.email}</h1>
            <h2>jjjjj</h2>
        </>
    );
}
