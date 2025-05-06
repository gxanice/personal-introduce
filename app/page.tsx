import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import SkillsSection from "@/components/skills-section"
import ProjectsSection from "@/components/projects-section"
import ExperienceSection from "@/components/experience-section"
import ContactSection from "@/components/contact-section"
import DynamicBackground from "@/components/dynamic-background"

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <DynamicBackground />
      <div className="container mx-auto px-4 relative z-10">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </div>
    </main>
  )
}
