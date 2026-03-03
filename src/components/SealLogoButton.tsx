"use client";

import { useState } from "react";
import styles from "./SealLogoButton.module.css";

type Props = {
  onOpen: () => void;
  size?: number;
  src?: string;
};

export default function SealLogoButton({
  onOpen,
  size = 170,
  src = "/Logo.svg",
}: Props) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    // espera a que termine la animación y luego ejecuta tu acción
    setTimeout(onOpen, 450);
  };

  return (
    <button
      type="button"
      className={`${styles.seal} ${clicked ? styles.clicked : ""}`}
      style={{ ["--sz" as any]: `${size}px` }}
      onClick={handleClick}
      aria-label="Abrir invitación"
    >
      <img className={styles.logo} src={src} alt="" draggable={false} />
    </button>
  );
}