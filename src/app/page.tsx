import { Navbar } from "@/components/navbar"
import HeroSection from "@/components/sections/hero/section"
import PreviewSection from "@/components/sections/preview/section"
import FeaturesSection from "@/components/sections/features"
import ContactSection from "@/components/sections/contacts"
import { ComparisonSection } from "@/components/sections/comparison/section"

export default function Home() {
  return (
    <div className="min-h-screen relative bg-linear-to-b from-gray-900 to-gray-950">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-b from-background via-background/90 to-background" />
        <div
          className="absolute -right-50 -top-50 h-300 w-300 rounded-full blur-[250px]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0) 90%)'
          }}
        />

        <div
          className="absolute -bottom-75 -left-50 h-225 w-225 rounded-full blur-[250px]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0) 90%)'
          }}
        />
      </div>
      <Navbar />
      <HeroSection />
      <PreviewSection />
      <ComparisonSection />
      <FeaturesSection />
      <ContactSection />
    </div>
  )
}