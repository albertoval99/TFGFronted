import iconoError from "/src/assets/icono-error.svg";
import iconoSuccess from "/src/assets/icono-success.svg";
import iconoCerrar from "/src/assets/icono-cerrar.svg";

export function Mensaje({ error, success, onClose }) {
    if (!error && !success) return null;

    return (
        <div className="flex flex-col w-60 sm:w-72 text-[10px] sm:text-xs z-50 fixed bottom-4 right-4">
            <div className="cursor-default flex items-center justify-between w-full h-12 sm:h-14 rounded-lg px-[10px] bg-[#232531]">
                <div className="flex items-center flex-1">
                    <div className={`bg-white/5 backdrop-blur-xl p-1 rounded-lg ${error ? "text-[#d65563]" : "text-green-500"}`}>
                        <img
                            src={error ? iconoError : iconoSuccess}
                            alt={error ? "Error" : "Éxito"}
                            className="w-5 h-5"
                        />
                    </div>
                    <div className="text-center ml-2.5">
                        <p className="text-white">
                            {(error || success)
                                .split("\n")
                                .map((line, index) => (
                                    <span key={index}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                        </p>
                    </div>
                </div>
                <button
                    className="text-gray-600 hover:bg-white/10 p-1 rounded-md transition-colors ease-linear"
                    onClick={onClose}
                >
                    <img
                        src={iconoCerrar}
                        alt="Cerrar"
                        className="w-5 h-5"
                    />
                </button>
            </div>
        </div>
    );
}