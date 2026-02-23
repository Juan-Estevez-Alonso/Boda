import "./globals.css";
import localFont from "next/font/local";

export const metadata = {
  title: "Mariana & Juan — 03.10.2026",
  description: "Info de la boda, RSVP y canciones para la fiesta.",
};

const laLuxes = localFont({
  src: [{ path: "../fonts/LaLuxes-regular.otf", weight: "400", style: "normal" }],
  variable: "--font-lux",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={laLuxes.variable}>{children}</body>
    </html>
  );
}
