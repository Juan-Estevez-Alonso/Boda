
import RSVPForm from "@/components/RSVPForm";
import SongRequests from "@/components/SongRequests";
import Maps from "@/components/Maps";
import Section from "@/components/Section";
import FlipCountdown from "@/components/FlipCountdown";
import Image from "next/image";
import HeroPaint from "@/components/HeroPaint";
import ScrollReveal from "@/components/ScrollReveal";
import EnvelopeIntro from "@/components/EnvelopeIntro";
import AfterHeroBlock from "@/components/AfterHeroBlock";
import RevealOnce from "@/components/RevealOnce";
import WeddingEnvelopeIntro from "@/components/WeddingEnvelopeIntro";

// #c3b494
export default function Page() {
  return (
    <>
      {/* <EnvelopeIntro /> */}
      <WeddingEnvelopeIntro />
      {/* HERO */}
      <header id="inicio" className="hero">

        {/* Fondo */}
        <Image
          src="/Hero3.svg"
          alt="Mariana y Juan"
          fill
          priority
          sizes="100vw"
          className="heroImg"
        />

        {/* Overlay suave para legibilidad */}
        <div className="heroOverlay" />
        {/* <HeroPaint />
  <div className="heroPaintReveal" aria-hidden="true" />
  <link rel="preload" href="/paint-mask-v2.svg" as="image" type="image/svg+xml" /> */}
        {/* <div className="heroVignette" /> */}
        {/* Logo */}
        <div className="afterHeroLogoWrap">
          <Image
            src="/Logo.svg"
            alt="Mariana & Juan"
            width={260}
            height={140}
            priority
            className="afterHeroLogo"
          />
        </div>

        {/* Texto encima (solo “Nos casamos” + frase) */}
        <div className="heroIntro">
          <div className="heroIntroInner">
            <h1 className="heroIntroTitle">¡Nos casamos!</h1>
            <p className="heroIntroText">Queremos que nos acompañes en este día tan especial</p>
          </div>
        </div>

        {/* Hint justo antes de terminar el hero */}
        <div className="heroHint" aria-hidden="true">
          <span className="heroHintText">Desliza</span>

          {/* <span className="heroHintTrack">
    <span className="heroHintDot" />
  </span> */}

          <span className="heroHintArrow">↓</span>
        </div>
      </header>
      <AfterHeroBlock />
      <RevealOnce>
        <div className="ceremoniaBg">


          <Section
            id="ceremonia"
            kicker="El gran momento"
            title="Ceremonia"
          >
            <div className="grid2">

              <RevealOnce className="revealPadding" >
                <p className="p" style={{ marginTop: 0 }}>
                  La parte bonita (y sí, se llora)
                </p>
                <p className="p" style={{ marginTop: 0 }}>
                  Será en la <b>Parroquia Nuestra Señora del Mar</b>, en <b>Isla Cristina (Huelva)</b>.
                  Empieza a las <b>12:00</b>. Llegar 10–15 min antes es de gente elegante.
                </p>
                <div
                  className="photoMasked"
                  style={{
                    WebkitMaskImage: "url('/imgmask2.png')",
                    maskImage: "url('imgmask2.png')",
                  }}
                >
                  <Image
                    src="/Iglesia3.svg"
                    alt="Parroquia Nuestra Señora del Mar, Isla Cristina"
                    fill
                    sizes="(max-width: 860px) 100vw, 520px"
                    className="photoMaskedImg"
                    priority
                  />
                </div>
              </RevealOnce>

              <RevealOnce className="revealPadding">
                <div className="kicker">Aviso serio (pero no mucho)</div>
                <div style={{ fontFamily: "var(--font-lux)", fontSize: 24, lineHeight: 1.2, textAlign: "center", marginTop: 10 }}>
                  “Si llegas tarde… te aplaudimos igualmente, pero bajito.”  <p className="p">😁</p>
                </div>

              </RevealOnce>
            </div>
          </Section>
        </div>
      </RevealOnce>
     
      <RevealOnce>
        <div className="celebracionBg">
          <Section
            id="celebracion"
            kicker="Ahora sí: comer, brindar y bailar"
            title="Celebración"
          >
            <div className="grid2">
              {/* IZQUIERDA: imagen */}
              <RevealOnce className="revealPadding">
                <p className="p" style={{ marginTop: 0 }}>
                  La celebración será en <b>Espacio Capitana</b>, en <b>Isla Cristina (Huelva)</b>,
                  a las <b>14:00</b>. A partir de aquí, todo son buenas decisiones.
                </p>


                {/* Fondo relleno (blur) */}
                <div
                  className="photoMasked"
                  style={{
                    WebkitMaskImage: "url('/imgmask2.png')",
                    maskImage: "url('imgmask2.png')",
                  }}
                >
                  <Image
                    src="/Capitana.svg"
                    alt="Espacio Capitana, Isla Cristina"
                    fill
                    sizes="(max-width: 860px) 100vw, 520px"
                    className="photoMaskedImg"
                    priority
                  />
                </div>

              </RevealOnce>

              {/* DERECHA: texto */}
              <RevealOnce className="revealPadding">
                <div className="kicker">Plan del día (versión realista)</div>
                <ul style={{ color: "var(--muted)", lineHeight: 1.9, paddingLeft: 18, marginBottom: 50 }}>
                  <li><b>Llegas</b> y saludas como si conocieras a todo el mundo.</li>
                  <li><b>Comes</b> (sí, repetir está permitido).</li>
                  <li><b>Bailas</b> (y aquí empieza la leyenda).</li>
                </ul>
                <a className="btn btnPrimary" href="#musica">Quiero proponer temazos</a>
              </RevealOnce>
            </div>
          </Section>
        </div>          
      </RevealOnce>
      {/* Itinerario */}
      <RevealOnce>
        <div className="ceremoniaBg">
          <Section
            id="itinerario"
            kicker="Para que no te pierdas ni el beso"
            title="Itinerario"
          >
            <div className="grid2">
          <RevealOnce>   
            <div className="card timelineCard" style={{ padding: 18 }}>
                  <ol className="timeline">
                    <li className="timelineItem">
                      <div className="timelineIcon" aria-hidden>⛪</div>
                      <div className="timelineBody">
                        <div className="timelineTop">
                          <div className="timelineTime">12:00</div>
                          <div className="timelineTag">Ceremonia</div>
                        </div>
                        <div className="timelineText">
                          Parroquia Nuestra Señora del Mar · Isla Cristina
                        </div>
                      </div>
                    </li>

                    <li className="timelineItem">
                      <div className="timelineIcon" aria-hidden>🥂</div>
                      <div className="timelineBody">
                        <div className="timelineTop">
                          <div className="timelineTime">14:00</div>
                          <div className="timelineTag">Celebración</div>
                        </div>
                        <div className="timelineText">
                          Espacio Capitana · Comida, brindis y empezar a liarla con clase
                        </div>
                      </div>
                    </li>

                    <li className="timelineItem">
                      <div className="timelineIcon" aria-hidden>🍰</div>
                      <div className="timelineBody">
                        <div className="timelineTop">
                          <div className="timelineTime">15:30</div>
                          <div className="timelineTag">Momentitos</div>
                        </div>
                        <div className="timelineText">
                          Brindis + sorpresas + fotos que luego pedirás
                        </div>
                      </div>
                    </li>

                    <li className="timelineItem">
                      <div className="timelineIcon" aria-hidden>🎶</div>
                      <div className="timelineBody">
                        <div className="timelineTop">
                          <div className="timelineTime">17:00</div>
                          <div className="timelineTag">Fiesta</div>
                        </div>
                        <div className="timelineText">
                          Aquí empieza la leyenda. Trae temazos y suelas resistentes.
                        </div>
                      </div>
                    </li>
                  </ol>
            </div>

            <div style={{ height: 12, marginTop: 16 }} />
            <a className="btn btnPrimary" href="#mapa">Ver ubicaciones</a>
          </RevealOnce>

              <RevealOnce style={{ padding: 16 }}>
                <div className="kicker">Notas rápidas</div>
                <ul style={{ color: "var(--muted)", lineHeight: 1.9, paddingLeft: 18, marginBottom: 14 }}>
                  <li>Llega 10–15 min antes a la iglesia (nivel pro).</li>
                  <li>En la celebración: come, brinda, baila. Repite.</li>
                  <li>Si vas a recomendar canción, hazlo en “Temazos”.</li>
                </ul>

                <div className="card" style={{ padding: 16 }}>
                  <div className="kicker">¿Vienes con peques?</div>
                  <div className="help" style={{ marginTop: 10 }}>
                    Dínoslo en el RSVP para tenerlo todo controlado 🙌
                  </div>
                </div>
              </RevealOnce>
            </div>
          </Section>
        </div>
      </RevealOnce>
      { /* Regalo */ }
       <RevealOnce>
        <div className="celebracionBg">
          <Section
            id="regalo"
            kicker="Si quieres tener un detalle"
            title="Regalo"
          >
            <div className="grid2">
              <RevealOnce className="revealPadding">
                <p className="p" style={{ marginTop: 0 }}>
                  Lo más importante es que vengas y lo pases brutal. Pero si te apetece ayudarnos con la luna de miel, la boda, la casa, los niños(que ya vendrán) o lo que tú quieras... 
                  aquí tienes la opción más cómoda 😄
                </p>

                <div className="card" style={{ padding: 16 }}>
                  <div className="kicker">Transferencia / Bizum</div>
                  <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                    <Row title="IBAN" value="ES46 2100 7147 3202 0017 3587" />
                    <Row title="Titular" value="Juan Estévez Alonso o Mariana Pérez García" />
                    <Row title="Concepto" value="Boda M&J" />
                  </div>

                  <div className="help" style={{ marginTop: 10 }}>
                    (Pon lo que quieras. De verdad. Aquí no se juzga. O si... 😌)
                  </div>
                </div>

                <div style={{ height: 12 }} />
                <a className="btn btnPrimary" href="#rsvp">Confirmar asistencia</a>
              </RevealOnce>

              <RevealOnce className="revealPadding">
                <div className="kicker">Para los detallistas</div>
                <p className="p" style={{ marginTop: 10 }}>
                  Si prefieres algo “de toda la vida”, un sobre, una sorpresa o un detalle personal… también nos encanta.
                  Solo prométenos que no será una batidora industrial 😅
                </p>

                {/* Slot foto */}
                {/* <div className="photoSlot" style={{ padding: 0, position: "relative", overflow: "hidden" }}>
                  <div className="help" style={{ textAlign: "center" }}>
                    Slot para foto/ilustración (maletas, flores, oliva…).
                  </div>
                </div> */}
              </RevealOnce>
            </div>
          </Section>
        </div>
      </RevealOnce>
      <RevealOnce>
        <div className="ceremoniaBg">
          <Section
            id="dresscode"
            kicker="Pista para ir guapísimo/a"
            title="Dresscode"
          >
            <div className="grid2">
              <RevealOnce className="revealPadding">
                <p className="p" style={{ marginTop: 0 }}>
                  Queremos un ambiente elegante pero cómodo. O sea: <b>arreglado/a</b>, pero sin sufrir.
                </p>
                <p className="p" style={{ marginTop: 0 }}>
                  Te puedes vestir de los colores que quieras pero el blanco está reservado para la novia, las damas tienen orden de tirar vino si alguien viene de blanco.
                  El que avisa no es traidor 😄
                </p>

              

                <div style={{ height: 12 }} />
                <div className="help">
                  Tip: Si dudas, trae una chaquetita ligera. Octubre engaña 😉
                </div>
              </RevealOnce>

              
            </div>
          </Section>
        </div>
      </RevealOnce>
      {/* MUSICA */}
      <RevealOnce>
        <div className="celebracionBg">
          <Section
            id="musica"
            kicker="La fiesta la hacemos entre todos"
            title="Recomienda canciones"
          >
            <RevealOnce>
              <p className="p">
                Suelta tu propuesta. Si es un temazo, te lo vamos a agradecer públicamente.
                Si no… también, pero con miradita 😄
              </p>
            </RevealOnce>
            <SongRequests />
          </Section>
        </div>
      </RevealOnce>
      {/* ASISTENCIA */}
      <RevealOnce >
        <div style={{ background: "#ced3b1" }}>
        <Section
          id="rsvp"
          kicker="Importante: dinos si vienes"
          title="Confirmación de asistencia"
          
        >
          <RSVPForm />
        </Section>
        </div>
      </RevealOnce>
      
      <RevealOnce>
        <Section
          id="mapa"
          kicker="Para que no acabes en Portugal"
          title="Mapa"
        >
          <Maps />
        </Section>
      </RevealOnce>
      <RevealOnce>
      <footer style={{ padding: "52px 0" }}>
        <div className="container">
          <div className="" style={{ padding: 16, textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-lux)", fontSize: 24, letterSpacing: ".06em" }}>
              Mariana <span style={{ color: "var(--accent)" }}>&</span> Juan
            </div>
            <div className="help" style={{ marginTop: 10 }}>
              ¿Dudas de última hora? Escríbenos:
              <br />
              Mariana: <b>692 496 719</b> · Juan: <b>638 270 013</b>
            </div>
          </div>
        </div>
      </footer>
      </RevealOnce>
    </>
  );
}

function Row({ title, value }: { title: string; value: string }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", gap: 10,
      padding: "10px 12px", border: "1px solid var(--line)",
      borderRadius: 14, background: "rgba(255,255,255,.55)"
    }}>
      <div className="help">{title}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}
