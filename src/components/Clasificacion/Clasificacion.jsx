import { useEffect, useState } from 'react';
import { clasificacionService } from '../../services/clasificacion.service';
import { useParams } from 'react-router';
import "./Clasificacion.css";
import { Mensaje } from '../Error/Mensaje';

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

  function obtenerClaseFilaClasificacion(indice, totalEquipos) {
    const clases = ['row-hover'];
    if (indice === 0) clases.push('first-place');
    if (indice === 1 || indice === 2) clases.push('podium');
    if (indice >= totalEquipos - 3) clases.push('relegation');
    return clases.join(' ');
  }

  function obtenerClaseDiferenciaGoles(diferencia) {
    if (diferencia > 0) {
      return 'dg-positive';
    } else if (diferencia < 0) {
      return 'dg-negative';
    } else {
      return 'dg-neutral';
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="clasificacion-container">
      <Mensaje
        error={error}
        onClose={() => { setError("") }}
      />
      <div className="clasificacion-card">
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
                <th>Pts</th>
                <th>PJ</th>
                <th>GF</th>
                <th>GC</th>
                <th>DG</th>
              </tr>
            </thead>
            <tbody>
              {clasificacion.map((eq, i) => (
                <tr key={eq.id_equipo} className={obtenerClaseFilaClasificacion(i, clasificacion.length)} title={eq.nombre}>
                  <td>{i + 1}</td>
                  <td className="equipo-cell">
                    <img src={eq.escudo} alt={eq.nombre} className="equipo-logo" />
                    <span>{eq.nombre}</span>
                  </td>
                  <td>{eq.puntos}</td>
                  <td>{eq.partidos_jugados}</td>
                  <td>{eq.goles_favor}</td>
                  <td>{eq.goles_contra}</td>
                  <td className={obtenerClaseDiferenciaGoles(eq.diferencia_goles)}>
                    {eq.diferencia_goles}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
