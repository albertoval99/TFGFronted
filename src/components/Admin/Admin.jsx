import { useOutletContext } from "react-router";

export default function Admin() {
    const { usuario, setUsuario } = useOutletContext();

    return (
        <>
            <h1>Adminr: {usuario?.email}</h1>
            <h2>gggggg</h2>
        </>
    );
}
