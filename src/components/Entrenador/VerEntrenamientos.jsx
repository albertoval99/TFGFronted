import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { entrenamientoService } from "../../services/entrenamiento.service";
import VerAsistencias from "./VerAsistencias";
import { Mensaje } from "../Error/Mensaje";

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
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                                                    />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const response = await entrenamientoService.eliminarEntrenamiento(entrenamiento.id_entrenamiento);

                                                        if (response.status === 200) {
                                                            setEntrenamientos(entrenamientos.filter(
                                                                (e) => e.id_entrenamiento !== entrenamiento.id_entrenamiento
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
                                                }}
                                                className="p-2 text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                                                title="Eliminar entrenamiento"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                    />
                                                </svg>
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