import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { entrenamientoService } from "../../services/entrenamiento.service";

export default function VerAsistencias() {
    const navigate = useNavigate();
    const { id_entrenamiento } = useParams(); 
    const [asistencias, setAsistencias] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

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
                setError("Error al cargar las asistencias");
                console.log("Error al cargar las asistencias", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAsistencias();
    }, [id_entrenamiento]);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="text-white">Cargando asistencias...</div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-8 pt-32">
            <div className="max-w-4xl mx-auto">
                {error && (
                    <div className="flex flex-col w-60 sm:w-72 text-[10px] sm:text-xs z-50 fixed bottom-4 right-4">
                        <div className="cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-lg px-[10px] bg-[#232531]">
                            <div className="flex items-center flex-1">
                                <div className="bg-white/5 backdrop-blur-xl p-1 rounded-lg text-[#d65563]">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                                        />
                                    </svg>
                                </div>
                                <div className="text-center ml-3">
                                    <p className="text-white">{error}</p>
                                </div>
                            </div>
                            <button
                                className="text-gray-600 hover:bg-white/10 p-1 rounded-md transition-colors ease-linear cursor-pointer"
                                onClick={() => setError(null)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-white">Lista de Asistencias</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-gradient-to-r from-[#e81cff] to-[#40c9ff] text-white rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        Volver
                    </button>
                </div>

                {asistencias.length === 0 ? (
                    <div className="bg-neutral-900/50 border border-neutral-800 text-white p-6 rounded-lg text-center">
                        No hay asistencias registradas
                    </div>
                ) : (
                    <div className="space-y-4">
                        {asistencias.map((asistencia) => (
                            <div
                                key={asistencia.id_asistencia}
                                className="bg-black p-6 rounded-lg border border-neutral-800 hover:border-[#40c9ff] transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <div className="text-lg font-semibold text-white">
                                            {asistencia.nombre} {asistencia.apellidos}
                                        </div>
                                        <div className="text-neutral-400">
                                            Estado: {' '}
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
                                            <div className="text-neutral-400">
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
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}