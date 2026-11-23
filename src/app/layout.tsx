import type { Metadata, Viewport } from "next";
import { Anton, Caveat, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-handwriting",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thiago Ibrahim | Portfólio de Engenharia",
  description:
    "Portfólio de Engenharia de Software de Thiago Ibrahim Vieira. OpenCRM (SaaS Multi-Tenant), CodeAtlas, WhatsApp Auto Sticker, Wasper (CUDA float16) e sistemas reais.",
  metadataBase: new URL("https://portifolio-thiago-ibrahim.vercel.app"),
  openGraph: {
    title: "Thiago Ibrahim | Portfólio de Engenharia",
    description: "Portfólio de engenharia: TypeScript, React 19, Supabase RLS, Fastify, CUDA float16 e sistemas reais.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${anton.variable} ${caveat.variable} ${jetbrainsMono.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="bg-ground text-ink font-sans antialiased selection:bg-amber-400 selection:text-black">
        {children}
      </body>
    </html>
  );
}
