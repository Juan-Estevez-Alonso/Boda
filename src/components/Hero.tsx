'use client';

export default function Hero() {
  const scrollToRsvp = () => {
    const element = document.getElementById('rsvp');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-sand-50 via-white to-sand-100 px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-olive-800 mb-4 tracking-tight">
            Nos Casamos
          </h1>
          <p className="text-xl md:text-2xl text-olive-600 font-light">
            3 de Octubre de 2026
          </p>
        </div>

        <div className="my-12 md:my-16">
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Te invitamos a compartir con nosotros el día más especial de nuestras vidas.
          </p>
        </div>

        <div className="mb-12">
          <div className="inline-block">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-sand-200">
              <p className="text-gray-600 text-sm mb-6">Cuenta atrás para el gran día</p>
              <div className="mb-8">
                {typeof window !== 'undefined' && (
                  <div>
                    {/* El Countdown se cargará aquí */}
                    <div className="grid grid-cols-4 gap-2 md:gap-4">
                      <div className="bg-sand-100 rounded-lg p-3 md:p-4">
                        <div className="text-2xl md:text-4xl font-bold text-olive-600">
                          00
                        </div>
                        <div className="text-xs text-olive-700 mt-1">Días</div>
                      </div>
                      <div className="bg-sand-100 rounded-lg p-3 md:p-4">
                        <div className="text-2xl md:text-4xl font-bold text-olive-600">
                          00
                        </div>
                        <div className="text-xs text-olive-700 mt-1">Horas</div>
                      </div>
                      <div className="bg-sand-100 rounded-lg p-3 md:p-4">
                        <div className="text-2xl md:text-4xl font-bold text-olive-600">
                          00
                        </div>
                        <div className="text-xs text-olive-700 mt-1">Min</div>
                      </div>
                      <div className="bg-sand-100 rounded-lg p-3 md:p-4">
                        <div className="text-2xl md:text-4xl font-bold text-olive-600">
                          00
                        </div>
                        <div className="text-xs text-olive-700 mt-1">Seg</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Parroquia Nuestra Señora del Mar | Isla Cristina, Huelva
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={scrollToRsvp}
            className="btn-primary"
          >
            Confirmar Asistencia
          </button>
          <a
            href="#ceremonia"
            className="btn-secondary"
          >
            Ver Detalles
          </a>
        </div>
      </div>
    </section>
  );
}
