import { FeatureCard } from "@/components/feature-card"

export function FeaturesSection() {
  return (
    <section className="py-10 px-4">
      <div className="container mx-auto">
        <h2 className="text-white mt-4">Главное</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="Интеграция «из коробки»"
            description="Шаблон полностью встроен в синтаксис Typst и автоматически оформляет весь документ по ГОСТ"
          />
          <FeatureCard
            title="Быстрая компиляция"
            description="Высокая скорость компиляции документов без необходимости в дополнительных модулях"
          />
          <FeatureCard
            title="Простая настройка"
            description="Интуитивно понятный процесс настройки без необходимости глубоких знаний системы"
          />
        </div>
      </div>
    </section>
  )
}