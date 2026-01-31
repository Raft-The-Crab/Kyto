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
  color,
}: BentoItemProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={cn(
        'group row-span-1 rounded-3xl border border-border/50 shadow-soft hover:shadow-medium transition-all p-6 flex flex-col justify-between space-y-4',
        color || 'bg-card/50 backdrop-blur-sm',
        className
      )}
    >
      {header}
      <div className="group-hover:translate-x-1 transition-transform duration-200">
        <div className="mb-2 text-primary">{icon}</div>
        <div className="font-bold text-foreground text-xl mb-2">{title}</div>
        <div className="font-medium text-muted-foreground text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </motion.div>
  )
}
