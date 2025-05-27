import { useState } from "react";
import cerrarModalIcon from "/src/assets/cerrar-modal.svg";

export default function EditarJugadorModal({ jugador, onClose, onSave }) {
    const [formData, setFormData] = useState({
        posicion: jugador.posicion || '',
        numero_camiseta: jugador.numero_camiseta || '',
        activo: jugador.activo
    });
    const [error, setError] = useState("");

    const POSICIONES = ["PT", "DFC", "LI", "LD", "MC", "MCD", "MI", "MD", "EI", "ED", "DC"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const response = await onSave(formData);
        if (response && response.status !== 200) {
            setError(response.message || "Error al actualizar el jugador");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1c1c24] rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-white">
                        Editar Jugador
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-white"
                    >
                        <img
                            src={cerrarModalIcon}
                            alt="Cerrar"
                            className="w-6 h-6"
                        />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">
                            Posición
                        </label>
                        <select
                            value={formData.posicion}
                            onChange={(e) => setFormData({ ...formData, posicion: e.target.value })}
                            className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white text-sm"
                        >
                            <option value="">Selecciona posición</option>
                            {POSICIONES.map((pos) => (
                                <option key={pos} value={pos}>{pos}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-1">
                            Número de camiseta
                        </label>
                        <input
                            type="number"
                            value={formData.numero_camiseta}
                            onChange={(e) => setFormData({ ...formData, numero_camiseta: e.target.value })}
                            className="w-full px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 rounded-lg focus:outline-none focus:border-[#40c9ff] transition-colors text-white text-sm"
                            min="1"
                            max="99"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={formData.activo}
                            onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                            className="w-4 h-4 text-[#40c9ff] bg-neutral-900/50 border-neutral-800 rounded focus:ring-[#40c9ff]"
                        />
                        <label className="text-sm font-medium text-neutral-400">
                            Jugador activo
                        </label>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-2 rounded text-xs">
                            {error}
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