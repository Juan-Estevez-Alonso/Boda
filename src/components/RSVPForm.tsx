"use client";
import { useState } from "react";
import RevealOnce from "@/components/RevealOnce";

type Status = "idle" | "sending" | "ok" | "error";

export default function RSVPForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMsg("");

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);
    const [ts] = useState(Date.now());

    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      attendance: String(fd.get("attendance") ?? "").trim(),
      allergies: String(fd.get("allergies") ?? "").trim(),
      website: fd.get("website"), // honeypot
      ts, // timestamp para validación anti-bot
    };

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        throw new Error(json.message || "No se pudo enviar.");
      }

      setStatus("ok");
      setMsg("¡Perfecto! Te apuntamos. Ahora… a preparar el baile 😄");
      formEl.reset();
    } catch (err: any) {
      setStatus("error");
      setMsg(err?.message ?? "Ups… algo falló. Dale otra vez (o avísanos por WhatsApp).");
    }
  }

  return (
    <form onSubmit={onSubmit} className="" style={{ padding: 16 }}>
      {/* honeypot */}
      <input
        type="text"
        name="website"
        style={{ display: "none" }}
        autoComplete="off"
      />
      <div className="grid2">
        <RevealOnce className="field">
          <label className="help">Nombre y apellido</label>
          <input className="input" name="name" required placeholder="Ej: Armando Castillo" />
        </RevealOnce>

        <RevealOnce className="field">
          <label className="help">¿Vienes?</label>
          <select className="select" name="attendance" required defaultValue="">
            <option value="" disabled>Elige una opción</option>
            <option value="si">Sí, voy con ganas de liarla</option>
            <option value="no">No puedo (pero os quiero igual)</option>
          </select>
        </RevealOnce>
      </div>

      <div style={{ height: 12 }} />

      <RevealOnce className="field">
        <label className="help">Alergias / intolerancias / dieta</label>
        <textarea
          className="textarea"
          name="allergies"
          placeholder="Ej: sin gluten, frutos secos, vegano(tú no vienes)… aquí cuidamos a la gente ❤️"
        />
      </RevealOnce>

      <div style={{ height: 14 }} />
      <RevealOnce>
        <button className="btn btnPrimary" disabled={status === "sending"}>
          {status === "sending" ? "Enviando..." : "Confirmar asistencia"}
        </button>
      </RevealOnce>

      {msg && (
        <RevealOnce style={{ marginTop: 10, color: status === "error" ? "#8A1F1F" : "var(--olive)" }}>
          {msg}
        </RevealOnce>
      )}

      <RevealOnce className="help" style={{ marginTop: 10 }}>
        *Solo lo usamos para organizarnos. Nada de spam, palabra.
      </RevealOnce>
    </form>
  );
}