'use client';

export default function MapSection() {
  return (
    <section id="ubicaciones" className="section-container bg-gradient-to-b from-white to-sand-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="section-title text-center">Ubicaciones</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Ceremonia */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-sand-200">
            <div className="bg-sand-100 p-6 border-b border-sand-200">
              <h3 className="text-2xl font-semibold text-olive-800 mb-2">
                📍 Ceremonia
              </h3>
              <p className="text-gray-700 font-medium">
                Parroquia Nuestra Señora del Mar
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Isla Cristina, Huelva
              </p>
            </div>
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              {/* <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen=""
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBXQ6mVkXs9Q6xfW8H6-9YpVm8xPW8J9kk&q=Parroquia+Nuestra+Señora+del+Mar+Isla+Cristina+Huelva`}
              /> */}
            </div>
            <div className="p-4 bg-white">
              <a
                href="https://maps.google.com/?q=Parroquia+Nuestra+Señora+del+Mar+Isla+Cristina+Huelva"
                target="_blank"
                rel="noopener noreferrer"
                className="text-olive-600 hover:text-olive-700 font-medium text-sm inline-flex items-center gap-2"
              >
                Abrir en Google Maps →
              </a>
            </div>
          </div>

          {/* Celebración */}
          <div className="rounded-2xl overflow-hidden shadow-lg border border-sand-200">
            <div className="bg-sand-100 p-6 border-b border-sand-200">
              <h3 className="text-2xl font-semibold text-olive-800 mb-2">
                🎉 Celebración
              </h3>
              <p className="text-gray-700 font-medium">
                Espacio Capitana
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Isla Cristina, Huelva
              </p>
            </div>
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen=""
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBXQ6mVkXs9Q6xfW8H6-9YpVm8xPW8J9kk&q=Espacio+Capitana+Isla+Cristina+Huelva`}
              />
            </div>
            <div className="p-4 bg-white">
              <a
                href="https://maps.google.com/?q=Espacio+Capitana+Isla+Cristina+Huelva"
                target="_blank"
                rel="noopener noreferrer"
                className="text-olive-600 hover:text-olive-700 font-medium text-sm inline-flex items-center gap-2"
              >
                Abrir en Google Maps →
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-sand-50 rounded-2xl p-8 border border-sand-200">
          <h3 className="text-xl font-semibold text-olive-800 mb-4">
            💡 Información Útil
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-olive-700 mb-2">Transporte</h4>
              <p className="text-gray-600 text-sm">
                Si necesitas ayuda con el transporte, por favor indícanoslo en el formulario RSVP.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-olive-700 mb-2">Aparcamiento</h4>
              <p className="text-gray-600 text-sm">
                Ambas ubicaciones cuentan con aparcamiento disponible para los invitados.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-olive-700 mb-2">Horarios</h4>
              <p className="text-gray-600 text-sm">
                Ceremonia: 11:30 h | Celebración: 19:30 h (horario aproximado)
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-olive-700 mb-2">Contacto</h4>
              <p className="text-gray-600 text-sm">
                Para cualquier duda o consulta, puedes escribirnos un mensaje en el formulario RSVP.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
