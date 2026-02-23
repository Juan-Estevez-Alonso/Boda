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

    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("fail");

      setStatus("ok");
      setMsg("¡Perfecto! Te apuntamos. Ahora… a preparar el baile 😄");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
      setMsg("Ups… algo falló. Dale otra vez (o avísanos por WhatsApp).");
    }
  }

  return (
    <form onSubmit={onSubmit} className="" style={{ padding: 16 }}>
      <div className="grid2">
        <RevealOnce className="field">
          <label className="help">Nombre y apellido</label>
          <input className="input" name="name" required placeholder="Ej: Ana Pérez" />
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
