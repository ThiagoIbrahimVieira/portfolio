import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/sections/HeroSection";
import { ChronologySection } from "@/sections/ChronologySection";
import { ToolboxSection } from "@/sections/ToolboxSection";
import { JournalSection } from "@/sections/JournalSection";
import { PrinciplesSection } from "@/sections/PrinciplesSection";
import { ContactSection } from "@/sections/ContactSection";
import { FloatingBottomDock } from "@/components/mobile/FloatingBottomDock";
import { SmoothScroll } from "@/components/effects/SmoothScroll";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { SectionNavigator } from "@/components/effects/SectionNavigator";
import { ScrollProgressBar } from "@/components/effects/ScrollProgressBar";

export default function Page() {
  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between selection:bg-amber-400 selection:text-black">
      {/* Barra de Progresso de Rolagem no Topo */}
      <ScrollProgressBar />

      {/* Dynamic Smooth Scrolling with Lenis */}
      <SmoothScroll />

      {/* Navegador Lateral Direito de Seções (Pílula interativa + Teste de rolagem por seção) */}
      <SectionNavigator />

      {/* Street-Tech Custom Spring Cursor (Desktop) */}
      <CustomCursor />

      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ChronologySection />
        <ToolboxSection />
        <JournalSection />
        <PrinciplesSection />
        <ContactSection />
      </main>
      <Footer />
      <FloatingBottomDock />
    </div>
  );
}
