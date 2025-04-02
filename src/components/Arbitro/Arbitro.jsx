import { useOutletContext } from "react-router";

export default function Arbitro() {
    const { usuario } = useOutletContext();

    return (
        <>
            <h1>Arbitro: {usuario?.email}</h1>
            <h2>aaaaa</h2>
        </>
    );
}
