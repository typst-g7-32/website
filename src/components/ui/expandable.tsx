"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExpandableContentBlockProps {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
  icon?: React.ReactNode
}

export default function ExpandableContentBlock({
  title,
  children,
  defaultExpanded = false,
  icon,
}: ExpandableContentBlockProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const childElement = children as React.ReactElement
  const hasCustomProps = childElement?.type && typeof childElement.type !== 'string'

  return (
    <div className="w-full">
      <div className="hidden xl:block h-[70vh] min-h-[480px] rounded-xl overflow-hidden">
        {hasCustomProps 
          ? React.cloneElement(childElement, { isScrollable: true, showControls: true })
          : children
        }
      </div>

      <div className="xl:hidden">
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/30">
          
          <div
            className={cn(
              "relative w-full transition-[height] duration-300 ease-in-out will-change-[height]",
              isExpanded ? "h-[70vh]" : "h-[200px]"
            )}
          >
            {hasCustomProps
              ? React.cloneElement(childElement, { 
                  isScrollable: isExpanded, 
                  showControls: isExpanded 
                })
              : children
            }
          </div>

          <div 
             className={cn(
               "absolute bottom-10 left-0 right-0 h-30 bg-linear-to-t from-gray-800 via-gray-800/60 to-transparent pointer-events-none transition-opacity duration-300 z-10",
               isExpanded ? "opacity-0" : "opacity-100"
             )}
          />

          <div className="relative z-20 border-t border-gray-700/50 bg-gray-800/80 backdrop-blur-sm">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-gray-700/30"
            >
              <div className="flex items-center gap-2">
                {icon && <div className="text-blue-400">{icon}</div>}
                <span className="text-sm font-medium text-gray-200">
                  {isExpanded ? "Свернуть" : "Развернуть"} {title}
                </span>
              </div>
              <ChevronDown
                size={18}
                className={cn("text-gray-400 transition-transform duration-300", isExpanded && "rotate-180")}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
