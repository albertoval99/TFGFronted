import { useEffect, useState } from "react";
import { entrenamientoService } from "../../services/entrenamiento.service";

export default function VerAsistencias({ id_entrenamiento, fecha, onClose }) {
    const [asistencias, setAsistencias] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fetchAsistencias = async () => {
            try {
                const response = await entrenamientoService.getAsistenciasEntrenamiento(id_entrenamiento);
                if (response.status === 200) {
                    setAsistencias(response.asistencias);
                    setError(null);
                } else {
                    setError(response.message);
                    setAsistencias([]);
                }
            } catch (error) {
                console.log(error)
                setError("Error al cargar las asistencias");
            } finally {
                setLoading(false);
            }
        };

        fetchAsistencias();
    }, [id_entrenamiento]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm ">
            <div className="bg-[#232531] rounded-xl shadow-lg w-full max-w-xl mx-4">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-700">
                    <div>
                        <h2 className="text-lg font-bold text-white">Asistencias</h2>
                        <p className="text-sm text-neutral-400 mt-1">
                            {formatearFecha(fecha)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
               
                <div className="px-6 py-4 max-h-[54vh] overflow-y-auto">
                    {loading ? (
                        <div className="text-white text-center">Cargando asistencias...</div>
                    ) : error ? (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
                            {error}
                        </div>
                    ) : asistencias.length === 0 ? (
                        <div className="bg-neutral-900/50 border border-neutral-800 text-white p-6 rounded-lg text-center">
                            No hay asistencias registradas
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {asistencias.map((asistencia) => (
                                <div
                                    key={asistencia.id_asistencia}
                                    className="bg-black p-4 rounded-lg border border-neutral-800 flex justify-between items-center"
                                >
                                    <div>
                                        <div className="text-base font-semibold text-white">
                                            {asistencia.nombre} {asistencia.apellidos}
                                        </div>
                                        <div className="text-neutral-400">
                                            Estado:{" "}
                                            <span className={`font-medium ${
                                                asistencia.asistio === true ? 'text-green-500' :
                                                asistencia.asistio === false ? 'text-red-500' :
                                                'text-yellow-500'
                                            }`}>
                                                {asistencia.asistio === true ? 'Asistirá' :
                                                asistencia.asistio === false ? 'No asistirá' :
                                                'Pendiente'}
                                            </span>
                                        </div>
                                        {asistencia.justificacion && (
                                            <div className="text-neutral-400 text-xs">
                                                Justificación: {asistencia.justificacion}
                                            </div>
                                        )}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full ${
                                        asistencia.asistio === true ? 'bg-green-500/10 text-green-500' :
                                        asistencia.asistio === false ? 'bg-red-500/10 text-red-500' :
                                        'bg-yellow-500/10 text-yellow-500'
                                    }`}>
                                        {asistencia.asistio === true ? '✓' :
                                        asistencia.asistio === false ? '✕' :
                                        '?'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}