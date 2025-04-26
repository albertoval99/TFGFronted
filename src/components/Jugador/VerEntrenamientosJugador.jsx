import { useEffect, useState } from "react";
import { entrenamientoService } from "../../services/entrenamiento.service";

export default function VerEntrenamientosJugador() {
    const [entrenamientos, setEntrenamientos] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [justificacion, setJustificacion] = useState("");
    const [entrenamientoEditando, setEntrenamientoEditando] = useState(null);

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

    const handleAsistencia = async (id_entrenamiento, asistira) => {
        try {
            const response = await entrenamientoService.actualizarAsistencia(
                id_entrenamiento,
                {
                    asistio: asistira,
                    justificacion: justificacion
                }
            );

            if (response.status === 200) {
                setSuccess("Asistencia actualizada correctamente");
                // Actualizar el estado del entrenamiento
                setEntrenamientos(entrenamientos.map(entrenamiento => {
                    if (entrenamiento.id_entrenamiento === id_entrenamiento) {
                        return {
                            ...entrenamiento,
                            asistio: asistira,
                            justificacion: justificacion
                        };
                    }
                    return entrenamiento;
                }));
                setEntrenamientoEditando(null);
                setJustificacion("");
                setTimeout(() => setSuccess(""), 3000);
            } else {
                setError(response.message || "Error al actualizar la asistencia");
            }
        } catch (error) {
            setError(error.message || "Error al actualizar la asistencia");
            console.log("Error al actualizar la asistencia", error);
        }
    };

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-white">Cargando entrenamientos...</div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-8 pt-32">
            <div className="max-w-4xl mx-auto">
                {/* Mensajes de error y éxito */}
                {(error || success) && (
                    <div className="flex flex-col w-60 sm:w-72 text-[10px] sm:text-xs z-50 fixed bottom-4 right-4">
                        <div className={`cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-lg px-[10px] bg-[#232531]`}>
                            <div className="flex items-center flex-1">
                                <div className={`bg-white/5 backdrop-blur-xl p-1 rounded-lg ${error ? "text-[#d65563]" : "text-green-500"}`}>
                                    {error ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    )}
                                </div>
                                <div className="text-center ml-3">
                                    <p className="text-white">{String(error || success)}</p>
                                </div>
                            </div>
                            <button
                                className="text-gray-600 hover:bg-white/10 p-1 rounded-md transition-colors ease-linear cursor-pointer"
                                onClick={() => {
                                    setError("");
                                    setSuccess("");
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-white">Entrenamientos Programados</h1>
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
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="text-lg font-semibold text-white">
                                                {formatearFecha(entrenamiento.fecha_hora_entrenamiento)}
                                            </div>
                                            <div className="text-neutral-400">
                                                Duración: {entrenamiento.duracion}
                                            </div>
                                            {entrenamiento.asistio !== undefined && (
                                                <div className="text-neutral-400">
                                                    Estado: {' '}
                                                    <span className={`font-medium ${
                                                        entrenamiento.asistio === true ? 'text-green-500' : 
                                                        entrenamiento.asistio === false ? 'text-red-500' : 
                                                        'text-yellow-500'
                                                    }`}>
                                                        {entrenamiento.asistio === true ? 'Asistirás' : 
                                                         entrenamiento.asistio === false ? 'No asistirás' : 
                                                         'Pendiente'}
                                                    </span>
                                                </div>
                                            )}
                                            {entrenamiento.justificacion && (
                                                <div className="text-neutral-400">
                                                    Justificación: {entrenamiento.justificacion}
                                                </div>
                                            )}
                                        </div>
                                        {entrenamiento.asistio !== undefined && (
                                            <div className={`px-3 py-1 rounded-full ${
                                                entrenamiento.asistio === true ? 'bg-green-500/10 text-green-500' : 
                                                entrenamiento.asistio === false ? 'bg-red-500/10 text-red-500' : 
                                                'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                                {entrenamiento.asistio === true ? '✓' : 
                                                 entrenamiento.asistio === false ? '✕' : 
                                                 '?'}
                                            </div>
                                        )}
                                    </div>

                                    {entrenamientoEditando === entrenamiento.id_entrenamiento ? (
                                        <div className="space-y-4">
                                            <textarea
                                                className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg p-3 text-white placeholder-neutral-400 focus:outline-none focus:border-[#40c9ff]"
                                                placeholder="Justificación (opcional)"
                                                value={justificacion}
                                                onChange={(e) => setJustificacion(e.target.value)}
                                                rows="3"
                                            />
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleAsistencia(entrenamiento.id_entrenamiento, true)}
                                                    className="flex-1 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors cursor-pointer"
                                                >
                                                    Confirmar Asistencia
                                                </button>
                                                <button
                                                    onClick={() => handleAsistencia(entrenamiento.id_entrenamiento, false)}
                                                    className="flex-1 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors cursor-pointer"
                                                >
                                                    No Asistiré
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEntrenamientoEditando(null);
                                                        setJustificacion("");
                                                    }}
                                                    className="px-4 py-2 bg-neutral-500/10 text-neutral-400 rounded-lg hover:bg-neutral-500/20 transition-colors cursor-pointer"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setEntrenamientoEditando(entrenamiento.id_entrenamiento);
                                                setJustificacion(entrenamiento.justificacion || "");
                                            }}
                                            className="w-full px-4 py-2 bg-gradient-to-r from-[#e81cff] to-[#40c9ff] text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                                        >
                                            {entrenamiento.asistio !== undefined ? 'Modificar Asistencia' : 'Confirmar Asistencia'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}