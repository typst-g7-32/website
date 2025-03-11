import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/sections/hero"
import { PreviewSection } from "@/components/sections/preview"
import { FeaturesSection } from "@/components/sections/features"
import ContactSection from "@/components/sections/contacts"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] bg-purple-500/10 blur-[100px]" />
      </div>
      <Navbar />
      <HeroSection />
      <PreviewSection />
      <FeaturesSection />
      <ContactSection />
    </div>
  )
}