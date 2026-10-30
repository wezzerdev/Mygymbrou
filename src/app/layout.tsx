import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyGymBrou — AI Fitness, Live Gym & Vision Nutrition (AAA)",
  description:
    "Plataforma inteligente de entrenamiento en vivo, visión nutricional híbrida con Ollama y analítica de sobrecarga progresiva con diseño en escala de grises pura y evaluación WCAG AAA.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[#F4F4F5] text-zinc-950 dark:bg-[#09090B] dark:text-zinc-50 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
