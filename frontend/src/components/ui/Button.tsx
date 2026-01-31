'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl',
        outline: 'border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        premium:
          'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-xl px-3',
        lg: 'h-11 rounded-2xl px-8',
        xl: 'h-14 rounded-3xl px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  ripple?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      ripple = true,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !loading) {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const id = Date.now()

        setRipples(prev => [...prev, { x, y, id }])
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== id))
        }, 600)
      }
      onClick?.(e)
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        disabled={loading || props.disabled}
        {...props}
      >
        {ripple &&
          ripples.map(ripple => (
            <span
              key={ripple.id}
              className="absolute pointer-events-none rounded-full bg-white/30 animate-ripple"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 0,
                height: 0,
              }}
            />
          ))}
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
