import { useEffect, useState } from "react";
import { equipoService } from "../../services/equipos.service";
import cerrarModalIcon from "/src/assets/cerrar-modal.svg";

export default function AplazarPartidoModal({ partido, onClose, onSave }) {

    const [formData, setFormData] = useState({
        fecha_partido: extraerFechaFormateada(partido),
        hora_partido: extraerHoraFormateada(partido),
        id_estadio: partido.id_estadio || "",
    });
    const [estadios, setEstadios] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loadingEstadios, setLoadingEstadios] = useState(true);

    function extraerFechaFormateada(partido) {
        return partido.fecha_partido ? partido.fecha_partido.split("T")[0] : "";
    }

    function extraerHoraFormateada(partido) {
        if (!partido.hora_partido) return "";
        return partido.hora_partido.slice(0, 5); // Asi solo coge 00:00
    }

    function actualizarFormulario(campo, valor) {
        setFormData(prevData => ({
            ...prevData,
            [campo]: valor
        }));
    }

    function validarFormulario() {
        if (!formData.fecha_partido && !formData.hora_partido && !formData.id_estadio) {
            setError("Debe modificar al menos un campo para actualizar");
            return false;
        }

        if (formData.fecha_partido) {
            const fechaSeleccionada = new Date(formData.fecha_partido);
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            if (fechaSeleccionada < hoy) {
                setError("La fecha del aplazamiento no puede ser anterior a hoy");
                return false;
            }
        }

        return true;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validarFormulario()) {
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
    }

    function renderEstadiosSelector() {
        if (loadingEstadios) {
            return (
                <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#40c9ff]"></div>
                </div>
            );
        }

        return (
            <select
                value={formData.id_estadio}
                onChange={(e) => actualizarFormulario("id_estadio", e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white text-sm"
            >
                <option value="">Selecciona un estadio</option>
                {estadios.map((estadio) => (
                    <option key={estadio.id_estadio} value={estadio.id_estadio}>
                        {estadio.nombre} - {estadio.ubicacion}
                    </option>
                ))}
            </select>
        );
    }

    function renderMensajes() {
        return (
            <>
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
            </>
        );
    }

    useEffect(() => {
        async function cargarEstadios() {
            setLoadingEstadios(true);
            try {
                const data = await equipoService.getEstadios();
                if (Array.isArray(data)) {
                    setEstadios(data);
                } else {
                    setError("Error al cargar los estadios");
                }
            } catch {
                setError("Error al cargar los estadios");
            } finally {
                setLoadingEstadios(false);
            }
        }

        cargarEstadios();
    }, []);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1c1c24] rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">Aplazar Partido</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-white">
                        <img
                            src={cerrarModalIcon}
                            alt="Cerrar"
                            className="w-6 h-6"
                        />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-white">
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Fecha del partido</label>
                        <input
                            type="date"
                            value={formData.fecha_partido}
                            onChange={(e) => actualizarFormulario("fecha_partido", e.target.value)}
                            className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Hora del partido</label>
                        <input
                            type="time"
                            value={formData.hora_partido}
                            onChange={(e) => actualizarFormulario("hora_partido", e.target.value)}
                            className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">Estadio</label>
                        {renderEstadiosSelector()}
                    </div>

                    {renderMensajes()}

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