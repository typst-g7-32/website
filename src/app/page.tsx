import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/sections/hero"
import { PreviewSection } from "@/components/sections/preview"
import { FeaturesSection } from "@/components/sections/features"
import ContactSection from "@/components/sections/contacts"

export default function Home() {
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="absolute inset-0 -z-5 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div
          className="right-[-200px] top-[-200px] h-[1200px] w-[1200px] rounded-full blur-[250px]"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0) 90%)"
          }}
        />
        <div
          className="bottom-[600px] left-[-200px] h-[900px] w-[900px] rounded-full blur-[250px]"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0) 90%)"
          }}
        />
      </div>
      <Navbar />
      <HeroSection />
      <PreviewSection />
      <FeaturesSection />
      <ContactSection />
    </div>
  )
}