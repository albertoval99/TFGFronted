import SideBar from "./Sidebar";
import SideBarAdmin from "./SidebarAdmin";
import { useOutletContext } from "react-router";

export default function SideBarController() {
    const { usuario } = useOutletContext();
    if (!usuario) {
        return <SideBar />
    }

    
    return usuario.rol === "administrador" ? <SideBarAdmin /> : <SideBar />;
}
