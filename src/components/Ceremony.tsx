'use client';

export default function Ceremony() {
  return (
    <section id="ceremonia" className="section-container bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="section-title text-center">Ceremonia</h2>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="bg-sand-50 rounded-2xl p-8 border border-sand-200">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-olive-800 mb-2">
                  📍 Ubicación
                </h3>
                <p className="text-lg text-gray-700 font-medium">
                  Parroquia Nuestra Señora del Mar
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
                  11:30 h
                </p>
              </div>

              <div className="mb-6 border-t border-sand-200 pt-6">
                <h3 className="text-2xl font-semibold text-olive-800 mb-2">
                  📅 Fecha
                </h3>
                <p className="text-lg text-gray-700 font-medium">
                  Sábado, 3 de Octubre de 2026
                </p>
              </div>

              <div className="border-t border-sand-200 pt-6">
                <h3 className="text-2xl font-semibold text-olive-800 mb-2">
                  ℹ️ Información
                </h3>
                <p className="text-gray-600">
                  La ceremonia será una celebración íntima y significativa donde uniremos nuestras vidas ante Dios y nuestros seres queridos.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-square bg-gradient-to-br from-olive-100 to-sand-100 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">💒</div>
                <p className="text-olive-700 font-medium text-lg">
                  Un momento sagrado en nuestras vidas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
