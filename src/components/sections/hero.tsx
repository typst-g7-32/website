import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="pt-24 sm:pt-28 md:pt-32 px-4">
      <div className="container mx-auto">
        <div className="max-w-5xl mx-auto text-center mb-10 md:mb-14">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs sm:text-sm text-blue-400 mb-5 sm:mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
            ГОСТ 7.32-2017
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
            Оформляйте документы{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-600">
              автоматически
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-5 px-2 sm:px-0">
            Автоматизированный шаблон для оформления работ в соответствии с ГОСТ 7.32-2017. Сосредоточьтесь на содержании, а не на форматировании.
          </p>
          <div className="flex justify-center gap-3 sm:gap-4">
            <Button className="w-full sm:w-auto inline-flex justify-center items-center py-3 px-5 text-sm sm:text-base font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-600 focus:ring-1">
              <a
                href="https://typst.app/app?template=modern-g7-32&version=0.1.0"
                target="_blank"
                rel="noopener noreferrer"
              >
                Начать
              </a>
            </Button>
            <Button className="w-full sm:w-auto py-3 px-5 text-sm sm:text-base font-medium text-white rounded-lg bg-gray-700 hover:bg-gray-600 focus:ring-1">
              <a
                href="/docs"
              >
              Документация
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
