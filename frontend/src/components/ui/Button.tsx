import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-none text-xs font-black uppercase tracking-widest ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-4 border-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-neo hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground shadow-neo hover:bg-destructive/90',
        outline: 'bg-background hover:bg-muted text-foreground shadow-neo',
        secondary: 'bg-secondary text-secondary-foreground shadow-neo hover:bg-secondary/90',
        ghost: 'border-transparent shadow-none hover:bg-muted',
        link: 'text-primary underline-offset-4 hover:underline border-0 shadow-none',
        neo: 'bg-accent text-accent-foreground shadow-neo hover:bg-accent/90',
      },
      size: {
        default: 'h-12 px-6 py-3',
        sm: 'h-10 px-4',
        lg: 'h-16 px-10 text-sm',
        icon: 'h-12 w-12',
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    const ButtonElement = (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )

    if (asChild) return ButtonElement

    return (
      <motion.div whileTap={{ scale: 0.98 }} className="inline-block">
        {ButtonElement}
      </motion.div>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
