import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface BentoGridProps {
  className?: string
  children: React.ReactNode
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-6',
        className
      )}
    >
      {children}
    </div>
  )
}

interface BentoItemProps {
  className?: string
  title: string | React.ReactNode
  description: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
  color?: string
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
  color = 'bg-slate-50',
}: BentoItemProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={cn(
        'group row-span-1 rounded-3xl border-2 border-slate-900 shadow-neo hover:shadow-neo-lg transition-all p-6 flex flex-col justify-between space-y-4',
        color,
        className
      )}
    >
      {header}
      <div className="group-hover:translate-x-1 transition-transform duration-200">
        <div className="mb-2">{icon}</div>
        <div className="font-black text-slate-900 text-xl mb-2">{title}</div>
        <div className="font-medium text-slate-500 text-sm leading-relaxed">{description}</div>
      </div>
    </motion.div>
  )
}
