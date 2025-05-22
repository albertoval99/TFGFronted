import { useEffect, useState } from 'react';
import { clasificacionService } from '../../services/clasificacion.service';
import { useParams } from 'react-router';
import "./Clasificacion.css";

export default function Clasificacion() {
  const [clasificacion, setClasificacion] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id_liga } = useParams();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const datos = await clasificacionService.obtenerClasificacion(id_liga);
        setClasificacion(datos);
      } catch (error) {
        setError(error.message || 'Error al obtener la clasificación.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id_liga]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="clasificacion-container">
      {error && (
        <div className="fixed bottom-6 right-6 w-80 bg-red-600 text-white rounded-lg shadow-lg p-4 flex items-center space-x-3">
          {/* …icono y cierre… */}
        </div>
      )}
      <div className="clasificacion-card">
        {/* Leyenda en esquina superior derecha */}
        <div className="clasificacion-legend">
          <div className="legend-item">
            <span className="legend-color ascenso"></span> Ascenso
          </div>
          <div className="legend-item">
            <span className="legend-color playoff"></span> Play-off
          </div>
          <div className="legend-item">
            <span className="legend-color descenso"></span> Descenso
          </div>
        </div>

        <div className="table-wrapper">
          <table className="clasificacion-table">
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th>PJ</th>
                <th>Pts</th>
                <th>GF</th>
                <th>GC</th>
                <th>DG</th>
              </tr>
            </thead>
            <tbody>
              {clasificacion.map((eq, i) => {
                const isFirst = i === 0;
                const isPodium = i === 1 || i === 2;
                const isReleg = i >= clasificacion.length - 3;
                const rowClass = [
                  'row-hover',
                  isFirst ? 'first-place' : '',
                  isPodium ? 'podium' : '',
                  isReleg ? 'relegation' : ''
                ].filter(Boolean).join(' ');

                return (
                  <tr key={eq.id_equipo} className={rowClass} title={eq.nombre}>
                    <td>{i + 1}</td>
                    <td className="equipo-cell">
                      <img src={eq.escudo} alt={eq.nombre} className="equipo-logo" />
                      <span>{eq.nombre}</span>
                    </td>
                    <td>{eq.partidos_jugados}</td>
                    <td>{eq.puntos}</td>
                    <td>{eq.goles_favor}</td>
                    <td>{eq.goles_contra}</td>
                    <td className={
                      eq.diferencia_goles > 0 ? 'dg-positive' :
                      eq.diferencia_goles < 0 ? 'dg-negative' :
                      'dg-neutral'
                    }>
                      {eq.diferencia_goles}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
