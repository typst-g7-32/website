"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { FileText, Code, FileCode } from "lucide-react"

import { ComparisonSlide, type ComparisonData } from "./slide"
import { comparisonIcons } from "./card"
import { NavigationButton } from "./nav-button"
import { Heading } from "@/components/ui/heading"

const comparisons: ComparisonData[] = [
  {
    id: "word",
    competitor: "Word",
    competitorUrl: "https://www.microsoft.com/ru-ru/microsoft-365/word",
    competitorIcon: <FileText className="w-4 h-4" />,
    points: [
      {
        icon: comparisonIcons.code,
        title: "Код вместо визуального редактора",
        description:
          "Это может пугать, но, используя код, вы получаете надёжность, качество и одинаковый результат независимо от среды исполнения.",
        modernAdvantage: "Никаких потерянных файлов",
        competitorIssue: "Краш программы при работе с дипломом",
      },
      {
        icon: comparisonIcons.feather,
        title: "Никакого ручного форматирования",
        description:
          "Для создания отличного документа не потребуется вручную настраивать шрифты и стили — за вас этим займётся шаблон.",
        modernAdvantage: "Никакого ручного форматирования",
        competitorIssue: "Часы на настройку стилей и отступов",
      },
      {
        icon: comparisonIcons.link,
        title: "Автоматические ссылки",
        description:
          "В Typst можно крайне просто описать ссылку на изображение, таблицу, листинг или источник. Поддерживается BibTeX для библиографии.",
        modernAdvantage: "Ссылки обновляются автоматически",
        competitorIssue: "Сломанные перекрёстные ссылки",
      },
    ],
  },
  {
    id: "latex",
    competitor: "latex-g7-32",
    competitorUrl: "https://github.com/latex-g7-32/latex-g7-32",
    competitorIcon: <Code className="w-4 h-4" />,
    points: [
      {
        icon: comparisonIcons.zap,
        title: "Мгновенная компиляция",
        description:
          "Больше не нужно ждать сборки по несколько минут. Ввели символ — документ мгновенно перестроился благодаря инкрементальной компиляции.",
        modernAdvantage: "Инкрементальная сборка за миллисекунды",
        competitorIssue: "Полная пересборка при каждом изменении",
      },
      {
        icon: comparisonIcons.cpu,
        title: "Современный синтаксис",
        description:
          "Не нужно учить сложные макросы TeX. Typst — понятный язык, похожий на Python. Создавайте документы без боли.",
        modernAdvantage: "Понятный синтаксис, как в Python",
        competitorIssue: "Закрученные макросы TeX",
      },
      {
        icon: comparisonIcons.package,
        title: "Легковесность",
        description:
          "Typst - это один бинарный файл весом менее 60 МБ, он сразу готов к работе. Также есть официальный веб-интерфейс typst.app (аналог Overleaf).",
        modernAdvantage: "Работает из коробки",
        competitorIssue: "Дистрибутив в несколько гигабайт",
      },
    ],
    footnote:
      "* Выражаю благодарность авторам и контрибьюторам latex-g7-32. Ваш труд стал вдохновением для modern-g7-32.",
  },
  {
    id: "gostdown",
    competitor: "GOSTdown",
    competitorUrl: "https://gitlab.iaaras.ru/iaaras/gostdown",
    competitorIcon: <FileCode className="w-4 h-4" />,
    points: [
      {
        icon: comparisonIcons.package,
        title: "Богатая экосистема",
        description:
          "Вокруг Typst построена обширная инфраструктура: веб-редактор, пакетный менеджер Universe, расширение для VSCode, активное сообщество.",
        modernAdvantage: "Десятки готовых пакетов на Universe",
        competitorIssue: "Нет экосистемы",
      },
      {
        icon: comparisonIcons.cpu,
        title: "Единая технология",
        description:
          "Typst — полноценный язык программирования. Не понадобятся внешние инструменты вроде Python или Lua для автоматизации.",
        modernAdvantage: "Самодостаточная экосистема",
        competitorIssue: "Цепочка: Python -> Markdown → Pandoc → PDF",
      },
      {
        icon: comparisonIcons.file,
        title: "Нативная генерация PDF",
        description:
          "Typst не полагается на промежуточные форматы — создаёт PDF напрямую. Документ всегда выглядит одинаково.",
        modernAdvantage: "Прямой рендеринг в PDF",
        competitorIssue: "Конвертация через несколько форматов",
      },
    ],
  },
]

export function ComparisonSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  const scrollToIndex = useCallback(
    (index: number) => {
      if (scrollRef.current && !isScrolling) {
        setIsScrolling(true)
        const container = scrollRef.current
        const slideWidth = container.offsetWidth
        container.scrollTo({
          left: slideWidth * index,
          behavior: "smooth",
        })
        setTimeout(() => setIsScrolling(false), 500)
      }
    },
    [isScrolling],
  )

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      if (!hasUserInteracted) {
        setHasUserInteracted(true)
      }

      if (!isScrolling) {
        const container = scrollRef.current
        const slideWidth = container.offsetWidth
        const newIndex = Math.round(container.scrollLeft / slideWidth)
        if (newIndex !== activeIndex && newIndex >= 0 && newIndex < comparisons.length) {
          setActiveIndex(newIndex)
        }
      }
    }
  }, [activeIndex, isScrolling, hasUserInteracted])

  useEffect(() => {
    const container = scrollRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      return () => container.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  const goPrev = () => {
    setHasUserInteracted(true)
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1
      setActiveIndex(newIndex)
      scrollToIndex(newIndex)
    }
  }

  const goNext = () => {
    setHasUserInteracted(true)
    if (activeIndex < comparisons.length - 1) {
      const newIndex = activeIndex + 1
      setActiveIndex(newIndex)
      scrollToIndex(newIndex)
    }
  }

  return (
    <section className="relative py-8 overflow-x-clip">
      <Heading as="h2" title="Сравнение" centered/>
      <div className="absolute inset-0 pointer-events-none">
        <div className="comparison-gradient-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-300 h-200" />
        <div className="comparison-gradient-secondary absolute bottom-[20%] left-[10%] w-125 h-125" />
      </div>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide [-webkit-overflow-scrolling:touch]"
        >
          {comparisons.map((comp, idx) => (
            <div key={comp.id} className="min-w-full snap-center snap-always">
              <ComparisonSlide data={comp} isActive={activeIndex === idx} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center gap-8 -mt-3">
        <NavigationButton 
          direction="left" 
          onClick={goPrev} 
          disabled={activeIndex === 0}
          stopAnimation={hasUserInteracted}
        />
        <div className="flex gap-2">
          {comparisons.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setHasUserInteracted(true)
                setActiveIndex(idx)
                scrollToIndex(idx)
              }}
              className="p-1 bg-transparent border-none cursor-pointer"
              aria-label={`Перейти к слайду ${idx + 1}`}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === idx ? "w-8 bg-blue-500" : "w-1.5 bg-gray-400/30"
                  }`}
              />
            </button>
          ))}
        </div>

        <NavigationButton
          direction="right"
          onClick={goNext}
          disabled={activeIndex === comparisons.length - 1}
          stopAnimation={hasUserInteracted}
        />
      </div>
    </section>
  )
}
