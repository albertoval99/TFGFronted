import { useNavigate } from "react-router";
import './Error404.css';

export default function Error404() {
    const navigate = useNavigate();

    return (
        <div className="error404-viewport">
            <div className="error404-card">
                <div className="error404-card-inner">
                    <div className="error404-left">
                        <span className="error404-glow">404</span>
                    </div>
                    <div className="error404-right">
                        <h2 className="error404-subtitle">Página no encontrada</h2>
                        <p className="error404-desc">
                            Ups, la página que buscas no existe o ha sido movida.<br />
                            <span className="error404-highlight">¡Vuelve al inicio y sigue disfrutando del fútbol!</span>
                        </p>
                        <button
                            className="error404-btn"
                            onClick={() => navigate("/")}
                        >
                            Volver al inicio
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="error404-btn-icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}