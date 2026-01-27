import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs font-bold uppercase tracking-widest ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border active:scale-95 shadow-sm',
  {
    variants: {
      variant: {
        default:
          'bg-indigo-600 text-white border-indigo-700 hover:bg-indigo-700 shadow-indigo-500/20 focus-visible:ring-indigo-400',
        destructive:
          'bg-red-600 text-white border-red-700 hover:bg-red-700 shadow-red-500/20 focus-visible:ring-red-400',
        outline:
          'bg-white dark:bg-black border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-900 dark:text-white focus-visible:ring-slate-400',
        secondary:
          'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 shadow-emerald-500/20 focus-visible:ring-emerald-400',
        ghost:
          'border-transparent shadow-none hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 focus-visible:ring-slate-300',
        link: 'text-indigo-600 underline-offset-4 hover:underline border-0 shadow-none focus-visible:ring-indigo-300',
        neo: 'bg-white dark:bg-black text-black dark:text-white border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] focus-visible:ring-black dark:focus-visible:ring-white',
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
