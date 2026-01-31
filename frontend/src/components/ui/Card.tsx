'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva(
  'rounded-3xl border bg-card text-card-foreground shadow-sm transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border-border hover:shadow-lg',
        glass:
          'border-white/10 bg-[#0a0a0a]/40 backdrop-blur-xl hover:bg-[#0a0a0a]/60 hover:shadow-2xl',
        elevated: 'border-border shadow-md hover:shadow-xl hover:-translate-y-1',
        interactive:
          'border-border cursor-pointer hover:border-primary/50 hover:shadow-lg hover:scale-[1.02]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  hover3d?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hover3d = false, onMouseMove, onMouseLeave, ...props }, forwardedRef) => {
    const cardRef = React.useRef<HTMLDivElement>(null)
    const [rotateX, setRotateX] = React.useState(0)
    const [rotateY, setRotateY] = React.useState(0)

    // Handle forwarding the ref
    React.useImperativeHandle(forwardedRef, () => cardRef.current!)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!hover3d || !cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateXValue = ((y - centerY) / centerY) * -10
      const rotateYValue = ((x - centerX) / centerX) * 10

      setRotateX(rotateXValue)
      setRotateY(rotateYValue)
      onMouseMove?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setRotateX(0)
      setRotateY(0)
      onMouseLeave?.(e)
    }

    return (
      <div
        ref={cardRef}
        className={cn(cardVariants({ variant }), hover3d && 'transform-gpu', className)}
        style={
          hover3d
            ? {
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                transition: 'transform 0.1s ease-out',
              }
            : undefined
        }
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
