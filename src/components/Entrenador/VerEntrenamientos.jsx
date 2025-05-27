import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { entrenamientoService } from "../../services/entrenamiento.service";
import VerAsistencias from "./VerAsistencias";
import { Mensaje } from "../Error/Mensaje";
import iconoVerAsistencias from "/src/assets/icono-ver-asistencias.svg";
import iconoEliminar from "/src/assets/icono-eliminar.svg";

export default function VerEntrenamientos() {
    const navigate = useNavigate();
    const [entrenamientos, setEntrenamientos] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [mostrarAsistencias, setMostrarAsistencias] = useState(false);
    const [idEntrenamientoSeleccionado, setIdEntrenamientoSeleccionado] = useState(null);

    useEffect(() => {
        const fetchEntrenamientos = async () => {
            try {
                const response = await entrenamientoService.getEntrenamientosEquipo();
                if (response.status === 200) {
                    setEntrenamientos(response.entrenamientos);
                    setError(null);
                } else {
                    setError(response.message);
                    setEntrenamientos([]);
                }
            } catch (error) {
                setError("Error al cargar los entrenamientos");
                console.log("Error al cargar los entrenamientos", error)
            } finally {
                setLoading(false);
            }
        };

        fetchEntrenamientos();
    }, []);

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleVerAsistencias = (id_entrenamiento) => {
        setIdEntrenamientoSeleccionado(id_entrenamiento);
        setMostrarAsistencias(true);
    };

    const handleEliminarEntrenamiento = async (id_entrenamiento) => {
        try {
            const response = await entrenamientoService.eliminarEntrenamiento(id_entrenamiento);

            if (response.status === 200) {
                setEntrenamientos(entrenamientos.filter(
                    (e) => e.id_entrenamiento !== id_entrenamiento
                ));
                setSuccess("Entrenamiento eliminado con éxito");
                setTimeout(() => setSuccess(""), 3000);
            } else {
                setError(response.message || "Error al eliminar el entrenamiento");
            }
        } catch (error) {
            setError("Error al eliminar el entrenamiento");
            console.log("Error al eliminar el entrenamiento", error)
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#40c9ff]"></div>
            </div>
        );
    }

    return (
        <>
            <div className={`w-full min-h-screen p-8 pt-32 transition-opacity duration-300 ${mostrarAsistencias ? 'opacity-0 pointer-events-none' : ''}`}>
                <div className="max-w-4xl mx-auto">
                    <Mensaje
                        error={error}
                        success={success}
                        onClose={() => { setError(""); setSuccess(""); }}
                    />

                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold text-white">Entrenamientos Programados</h1>
                        <button
                            onClick={() => navigate('/crearEntrenamiento')}
                            className="px-4 py-2 bg-gradient-to-r from-[#e81cff] to-[#40c9ff] text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                        >
                            Nuevo Entrenamiento
                        </button>
                    </div>

                    {error ? (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
                            {error}
                        </div>
                    ) : entrenamientos.length === 0 ? (
                        <div className="bg-neutral-900/50 border border-neutral-800 text-white p-6 rounded-lg text-center">
                            No hay entrenamientos programados
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {entrenamientos.map((entrenamiento) => (
                                <div
                                    key={entrenamiento.id_entrenamiento}
                                    className="bg-black p-6 rounded-lg border border-neutral-800 hover:border-[#40c9ff] transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="text-lg font-semibold text-white">
                                                {formatearFecha(entrenamiento.fecha_hora_entrenamiento)}
                                            </div>
                                            <div className="text-neutral-400">
                                                Duración: {entrenamiento.duracion}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleVerAsistencias(entrenamiento.id_entrenamiento)}
                                                className="p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                                title="Ver asistencias"
                                            >
                                                <img
                                                    src={iconoVerAsistencias}
                                                    alt="Ver asistencias"
                                                    className="w-6 h-6"
                                                />
                                            </button>
                                            <button
                                                onClick={() => handleEliminarEntrenamiento(entrenamiento.id_entrenamiento)}
                                                className="p-2 text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                                                title="Eliminar entrenamiento"
                                            >
                                                <img
                                                    src={iconoEliminar}
                                                    alt="Eliminar"
                                                    className="w-6 h-6"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {mostrarAsistencias && (
                <VerAsistencias
                    id_entrenamiento={idEntrenamientoSeleccionado}
                    fecha={entrenamientos.find(e => e.id_entrenamiento === idEntrenamientoSeleccionado)?.fecha_hora_entrenamiento}
                    onClose={() => {
                        setMostrarAsistencias(false);
                        setIdEntrenamientoSeleccionado(null);
                    }}
                />
            )}
        </>
    );
}