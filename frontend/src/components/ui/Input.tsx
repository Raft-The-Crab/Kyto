import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-none border-4 border-black bg-white px-4 py-3 text-xs uppercase tracking-widest font-black ring-offset-background file:border-0 file:bg-transparent file:text-xs file:font-black placeholder:text-black/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        ref={ref}
        ...props
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
