import { useEffect, useState } from "react";
import { equipoService } from "../../services/equipos.service";

export default function AplazarPartidoModal({ partido, onClose, onSave }) {
    const [formData, setFormData] = useState({
        fecha_partido: partido.fecha_partido || "",
        hora_partido: partido.hora_partido || "",
        id_estadio: partido.id_estadio || "",
    });
    const [estadios, setEstadios] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loadingEstadios, setLoadingEstadios] = useState(true);

    useEffect(() => {
        async function fetchEstadios() {
            setLoadingEstadios(true);
            const data = await equipoService.getEstadios();
            if (Array.isArray(data)) {
                setEstadios(data);
            } else {
                setError("Error al cargar los estadios");
            }
            setLoadingEstadios(false);
        }
        fetchEstadios();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!formData.fecha_partido && !formData.hora_partido && !formData.id_estadio) {
            setError("Debe modificar al menos un campo para actualizar");
            return;
        }
        const response = await onSave(formData);
        if (response.status === 200) {
            setSuccess("Partido actualizado correctamente");
            setTimeout(() => {
                setSuccess("");
                onClose();
            }, 2000);
        } else {
            setError(response.message || "Error al actualizar el partido");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1c1c24] rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">Aplazar Partido</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-white">
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Fecha del partido</label>
                        <input
                            type="date"
                            value={formData.fecha_partido}
                            onChange={(e) => setFormData({ ...formData, fecha_partido: e.target.value })}
                            className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Hora del partido</label>
                        <input
                            type="time"
                            value={formData.hora_partido}
                            onChange={(e) => setFormData({ ...formData, hora_partido: e.target.value })}
                            className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Estadio</label>
                        {loadingEstadios ? (
                            <p>Cargando estadios...</p>
                        ) : (
                            <select
                                value={formData.id_estadio}
                                onChange={(e) => setFormData({ ...formData, id_estadio: e.target.value })}
                                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white text-sm"
                            >
                                <option value="">Selecciona un estadio</option>
                                {estadios.map((estadio) => (
                                    <option key={estadio.id_estadio} value={estadio.id_estadio}>
                                        {estadio.nombre_estadio}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-2 rounded text-xs">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-500/10 border border-green-500 text-green-500 p-2 rounded text-xs">
                            {success}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-neutral-400 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gradient-to-r from-[#e81cff] to-[#40c9ff] text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}