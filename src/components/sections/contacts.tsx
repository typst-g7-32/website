"use client"

import React, { useRef, useState } from "react"
import { Copy, Mail, Send, Check } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/buttons/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heading } from "../ui/heading"
import { InlineLink } from "../ui/inline-link"
import { NAVIGATION_LINKS } from "@/lib/navigation"

export default function ContactSection() {
  const [copied, setCopied] = useState<string | null>(null)
  const [formStatus, setFormStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  })
  const formRef = useRef<HTMLFormElement>(null)

  const contactInfo = [
    {
      icon: <Send className="h-5 w-5" />,
      label: "Телеграм беседа",
      value: "t.me/typst_gost",
      copyValue: "https://t.me/typst_gost",
      link: NAVIGATION_LINKS.TELEGRAM_CHAT,
    },
    {
      icon: <Send className="h-5 w-5" />,
      label: "Телеграм",
      value: "t.me/forgenet",
      copyValue: "t.me/forgenet",
      link: NAVIGATION_LINKS.TELEGRAM_AUTHOR,
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      value: "forgenet@inbox.ru",
      copyValue: "forgenet@inbox.ru",
    },
  ]

  const additionalInfo = [
    {
      title: "Задавайте вопросы",
      description: "Мы готовы помочь вам с любыми вопросами по Typst или шаблону modern-g7-32",
      icon: <Check className="h-5 w-5" />,
    },
  ]

  const copyToClipboard = (text: string, label: string) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopied(label)
          setTimeout(() => setCopied(null), 2000)
        })
        .catch(() => {})
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand("copy")
        setCopied(label)
        setTimeout(() => setCopied(null), 2000)
      } catch {
        console.error("Failed to copy text to clipboard")
      }
      document.body.removeChild(textArea)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const subject = formData.get("subject") as string
    const message = formData.get("message") as string
    if (!name || !email || !message) {
      setFormStatus({ type: "error", message: "Пожалуйста, заполните все обязательные поля" })
      return
    }
    setFormStatus({ type: "loading", message: "Отправка сообщения..." })
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject: subject || "Запрос с сайта", message }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setFormStatus({
          type: "success",
          message: "Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.",
        })
        formRef.current?.reset()
      } else throw new Error(data.message || "Что-то пошло не так")
      setTimeout(() => setFormStatus({ type: "idle", message: "" }), 5000)
    } catch {
      setFormStatus({
        type: "error",
        message: "Ошибка при отправке сообщения. Попробуйте снова или свяжитесь с нами напрямую.",
      })
    }
  }

  return (
    <section className="pb-14 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <Heading
          title="Остались вопросы?"
          highlight="Напишите!"
          description="Мы всегда открыты для сотрудничества и готовы ответить на ваши вопросы"
          centered
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 group">
          <Card className="bg-gray-800/30 border-gray-700/20 text-white z-1 backdrop-blur-xs">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Свяжитесь с нами</CardTitle>
              <CardDescription className="text-gray-400">
                Заполните форму, и мы свяжемся с вами в ближайшее время
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-300">
                      Имя <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Введите ваше имя"
                      className="bg-gray-900/70 border-gray-700/20 text-white placeholder:text-gray-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Введите ваш email"
                      className="bg-gray-900/70 border-gray-700/20 text-white placeholder:text-gray-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-300">
                    Тема
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Тема сообщения"
                    className="bg-gray-900/70 border-gray-700/20 text-white placeholder:text-gray-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-300">
                    Сообщение <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Введите ваше сообщение"
                    className="bg-gray-900/70 border-gray-700/20 text-white placeholder:text-gray-500 min-h-30 focus:border-blue-500"
                    required
                  />
                </div>
                {formStatus.type !== "idle" && (
                  <div
                    className={cn(
                      "p-3 rounded-md text-sm transition-colors duration-300",
                      formStatus.type === "success"
                        ? "bg-green-900/30 text-green-400 border border-green-800"
                        : formStatus.type === "error"
                        ? "bg-red-900/30 text-red-400 border border-red-800"
                        : "bg-blue-900/30 text-blue-400 border border-blue-800"
                    )}
                  >
                    {formStatus.message}
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={formStatus.type === "loading"}
                  className="w-full py-3 px-5 text-sm sm:text-base font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-600 focus:ring-1"
                >
                  {formStatus.type === "loading" ? "Отправка..." : "Отправить сообщение"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="bg-gray-800/30 border-gray-700/20 text-white z-1 backdrop-blur-xs">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Контакты</CardTitle>
                <CardDescription className="text-gray-400">Свяжитесь любым удобным способом</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start flex-wrap gap-3 sm:gap-4">
                    <div className="shrink-0 h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-[60%]">
                      <h4 className="text-sm font-medium text-gray-400">{item.label}</h4>
                      {item.link ? (
                        <InlineLink href={item.link}>{item.value}</InlineLink>
                      ) : (
                        <p className="text-white mt-1 break-all">{item.value}</p>
                      )}
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.copyValue, item.label)}
                      className="h-8 w-8 rounded-full bg-gray-900/70 border border-gray-700/20 flex items-center justify-center hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400 transition-all duration-300"
                    >
                      {copied === item.label ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="sr-only">Копировать {item.label}</span>
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700/20 text-white z-1 backdrop-blur-xs">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Дополнительная информация</CardTitle>
                <CardDescription className="text-gray-400">Полезная информация о наших услугах</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {additionalInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-3 sm:gap-4">
                    <div className="shrink-0 h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm sm:text-base font-medium text-white">{info.title}</h4>
                      <p className="text-gray-400 mt-1 text-sm sm:text-base">{info.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

