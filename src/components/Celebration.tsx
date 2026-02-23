'use client';

export default function Celebration() {
  return (
    <section id="celebracion" className="section-container bg-gradient-to-b from-white to-sand-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title text-center">Celebración</h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center justify-center order-2 md:order-1">
            <div className="relative w-full aspect-square bg-gradient-to-br from-sand-100 to-olive-100 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-olive-700 font-medium text-lg">
                  Música, danza y alegría
                </p>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <div className="bg-sand-50 rounded-2xl p-8 border border-sand-200">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-olive-800 mb-2">
                  📍 Ubicación
                </h3>
                <p className="text-lg text-gray-700 font-medium">
                  Espacio Capitana
                </p>
                <p className="text-gray-600 mt-2">
                  Isla Cristina, Huelva
                </p>
              </div>

              <div className="mb-6 border-t border-sand-200 pt-6">
                <h3 className="text-2xl font-semibold text-olive-800 mb-2">
                  🕰️ Hora
                </h3>
                <p className="text-lg text-gray-700 font-medium">
                  19:30 h
                </p>
              </div>

              <div className="mb-6 border-t border-sand-200 pt-6">
                <h3 className="text-2xl font-semibold text-olive-800 mb-2">
                  🍽️ Cena
                </h3>
                <p className="text-gray-600">
                  Disfrutaremos de una deliciosa cena seguida de baile y celebración hasta altas horas de la madrugada.
                </p>
              </div>

              <div className="border-t border-sand-200 pt-6">
                <h3 className="text-2xl font-semibold text-olive-800 mb-2">
                  🎵 Música en Vivo
                </h3>
                <p className="text-gray-600">
                  Dj y ambiente festivo para que la noche sea inolvidable. Tú puedes sugerir tus canciones favoritas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
