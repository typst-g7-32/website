import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="pt-32">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm text-blue-400 mb-6 dark:border-neutral-800">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2"></span>
            ГОСТ 7.32-2017
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Оформляйте документы {""}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
              автоматически
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Автоматизированный шаблон для оформления работ в соответствии с ГОСТ 7.32-2017. Сосредоточьтесь на
            содержании, а не на форматировании.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-600 focus:ring-1">
              <a
                href="https://github.com/typst-g7-32/typst-g7-32"
                target="_blank"
                rel="noopener noreferrer"
              >
                Начать
              </a>  
            </Button>
            <Button className="py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-gray-700 hover:bg-gray-600 focus:ring-1">
              <a
                href="https://github.com/typst-g7-32/typst-g7-32"
                target="_blank"
                rel="noopener noreferrer"
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