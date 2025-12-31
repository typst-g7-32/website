"use client"

import type React from "react"
import { useRef } from "react"
import { ExternalLink, FileText, Github, MessageCircle, Link } from "lucide-react"
import { Button } from "@/components/ui/buttons/button"
import { FeatureCard } from "@/components/feature-card"
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"
import { Heading } from "../ui/heading"
import { InlineLink } from "../ui/inline-link"

const LINKS = {
  telegram: "https://t.me/typst_gost",
  community: "https://t.me/typst_gost",
  repo: "https://github.com/typst-g7-32/modern-g7-32",
  template: "https://typst.app/universe/package/modern-g7-32",
  example: "https://typst.app/project/r5iwSJ49gzKzC8iGMprKI0",
  examples: "https://github.com/typst-g7-32/examples",
}

function ExternalLinkItem({
  href,
  icon: Icon,
  children,
}: { href: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-500/10 transition-all group/link"
    >
      <Icon className="h-5 w-5 text-blue-500" />
      <span className="flex-1 font-medium">{children}</span>
      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover/link:translate-x-1 transition-transform" />
    </a>
  )
}

function StepItem({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 text-sm font-bold shrink-0">
        {step}
      </span>
      <div className="flex-1 text-sm font-medium">{children}</div>
    </div>
  )
}

function CTABanner() {
  const ref = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const backgroundX = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"])
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])
  const blob1X = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const blob2X = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"])

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - 150);
    mouseY.set(e.clientY - rect.top - 150);
  };

  return (
    <div 
      ref={ref} 
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden rounded-2xl border border-blue-500/20 group/banner"
    >
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl z-10" />

      <motion.div className="absolute inset-0 z-0" style={{ x: backgroundX, y: backgroundY }}>
        <motion.div
          className="absolute -top-1/2 -left-1/4 w-150 h-150 rounded-full blur-[120px]"
          style={{ x: blob1X, background: "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)" }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/4 w-125 h-125 rounded-full blur-[100px]"
          style={{ x: blob2X, background: "radial-gradient(circle, rgba(168,85,247,0.35) 0%, transparent 70%)" }}
        />
      </motion.div>

      <motion.div
        className="absolute w-75 h-75 z-0 rounded-full blur-[80px] pointer-events-none opacity-0 group-hover/banner:opacity-100 transition-opacity duration-500"
        style={{ 
            left: mouseXSpring, 
            top: mouseYSpring,
            background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)" 
        }}
      />

      <div className="relative z-20 p-8 text-center">
        <h3 className="text-2xl font-bold mb-3 text-white">Готовы начать?</h3>
        <p className="text-gray-300 mb-6 max-w-3xl mx-auto text-pretty">
          Используйте шаблон для автоматизированного оформления документов по ГОСТ 7.32-2017
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20" asChild>
            <a href={LINKS.template} target="_blank" rel="noopener noreferrer">
              <Link className="mr-2 h-5 w-5" />
              Перейти к шаблону
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-gray-500/10 hover:bg-blue-500/10 bg-gray-900 backdrop-blur-sm text-white hover:text-blue-500 hover:border-blue-500/30"
            asChild
          >
            <a href={LINKS.example} target="_blank" rel="noopener noreferrer">
              <FileText className="mr-2 h-5 w-5" />
              Посмотреть пример
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function FeaturesSection() {
  return (
    <section className="relative py-8 px-4 overflow-hidden text-white">
      <div className="container relative mx-auto max-w-7xl">
        <Heading
          title="Важная информация"
          description="Всё, что нужно знать для работы с проектом и его поддержки"
          centered
        />

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <FeatureCard
            title="Документация"
            description="Документация шаблона в разработке, обратитесь за помощью напрямую"
          >
            <nav className="space-y-3">
              <ExternalLinkItem href={LINKS.telegram} icon={MessageCircle}>
                Telegram поддержка
              </ExternalLinkItem>
              <ExternalLinkItem href={LINKS.examples} icon={Github}>
                Примеры документов
              </ExternalLinkItem>
            </nav>
          </FeatureCard>

          <FeatureCard
            title="Поддержка проекта"
            description="Ваша помощь очень важна для развития проекта"
          >
            <div className="space-y-4">
              <StepItem step={1}>
                Поставьте звёздочку в <InlineLink href={LINKS.repo}>репозитории</InlineLink>
              </StepItem>
              <StepItem step={2}>Попробуйте шаблон и вернитесь с обратной связью</StepItem>
              <StepItem step={3}>
                Присоединяйтесь к <InlineLink href={LINKS.community}>сообществу</InlineLink>
              </StepItem>
            </div>
          </FeatureCard>
        </div>

        <CTABanner />
      </div>
    </section>
  )
}
