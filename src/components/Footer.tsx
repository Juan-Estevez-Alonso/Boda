'use client';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-olive-800 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <p className="text-sand-200 text-sm">
              Para cualquier pregunta o consulta, no dudes en escribirnos a través del formulario RSVP.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#ceremonia"
                  className="text-sand-200 hover:text-white transition-colors"
                >
                  Ceremonia
                </a>
              </li>
              <li>
                <a
                  href="#celebracion"
                  className="text-sand-200 hover:text-white transition-colors"
                >
                  Celebración
                </a>
              </li>
              <li>
                <a
                  href="#musica"
                  className="text-sand-200 hover:text-white transition-colors"
                >
                  Playlist
                </a>
              </li>
              <li>
                <a
                  href="#ubicaciones"
                  className="text-sand-200 hover:text-white transition-colors"
                >
                  Ubicaciones
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Fecha Especial</h3>
            <p className="text-sand-200 text-sm">
              Sábado, 3 de Octubre de 2026
            </p>
            <p className="text-sand-200 text-sm mt-4">
              Isla Cristina, Huelva
            </p>
          </div>
        </div>

        <div className="border-t border-olive-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sand-200 text-sm text-center md:text-left">
            © 2026 Nuestra Boda. Hecho con ❤️
          </p>
          <button
            onClick={scrollToTop}
            className="text-sand-200 hover:text-white transition-colors text-sm font-medium"
          >
            Volver al inicio ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
