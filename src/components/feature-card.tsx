import { ReactNode } from "react"

export interface FeatureCardProps {
  title?: string
  description?: ReactNode
}

export default function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="bg-gray-800/20 border border-gray-800/30 rounded-2xl p-5 sm:p-6 md:p-8 transition-all hover:bg-gray-800/30">
      {title && (
        <>
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-3 sm:mb-1">{title}</h3>
          <div className="space-y-1" />
        </>
      )}
      {description && <div className="text-sm sm:text-base text-gray-400 leading-relaxed">{description}</div>}
    </div>
  )
}
