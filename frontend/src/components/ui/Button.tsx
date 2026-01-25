import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-slate-900 active:translate-y-0 active:shadow-none',
  {
    variants: {
      variant: {
        default:
          'bg-indigo-600 text-white hover:bg-indigo-700 shadow-neo hover:-translate-y-0.5 hover:shadow-neo',
        destructive:
          'bg-red-500 text-white hover:bg-red-600 shadow-neo hover:-translate-y-0.5 hover:shadow-neo',
        outline:
          'bg-white hover:bg-slate-100 text-slate-900 shadow-neo hover:-translate-y-0.5 hover:shadow-neo',
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-neo-sm',
        ghost: 'border-transparent shadow-none hover:bg-slate-100',
        link: 'text-indigo-600 underline-offset-4 hover:underline border-0 shadow-none',
        neo: 'bg-yellow-400 text-slate-900 hover:bg-yellow-500 shadow-neo hover:-translate-y-0.5 hover:shadow-neo',
      },
      size: {
        default: 'h-11 px-4 py-2',
        sm: 'h-9 rounded-lg px-3',
        lg: 'h-14 rounded-2xl px-8 text-base',
        icon: 'h-11 w-11',
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
}

import { motion } from 'framer-motion'

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    // Wrap component definition logic
    const ButtonElement = (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )

    if (asChild) return ButtonElement

    return (
      <motion.div whileTap={{ scale: 0.95 }} className="inline-block">
        {ButtonElement}
      </motion.div>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
