'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showCharCount?: boolean
  maxLength?: number
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      error,
      leftIcon,
      rightIcon,
      showCharCount,
      maxLength,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [localValue, setLocalValue] = React.useState(value || '')
    const inputId = React.useId()

    React.useEffect(() => {
      setLocalValue(value || '')
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value)
      onChange?.(e)
    }

    const charCount = String(localValue).length
    const isOverLimit = maxLength ? charCount > maxLength : false

    return (
      <div className="w-full">
        <div className="relative">
          {/* Floating Label */}
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                'absolute left-3 transition-all duration-200 pointer-events-none text-sm font-medium',
                leftIcon && 'left-10',
                isFocused || localValue
                  ? '-top-2 text-xs bg-background px-1 text-primary'
                  : 'top-2.5 text-muted-foreground'
              )}
            >
              {label}
            </label>
          )}

          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            id={inputId}
            type={type}
            className={cn(
              'flex h-10 w-full rounded-xl border bg-background px-3 py-2 text-sm transition-all duration-200',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-destructive focus-visible:ring-destructive animate-shake'
                : 'border-input hover:border-input/80',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            maxLength={maxLength}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {rightIcon}
            </div>
          )}

          {/* Focus Ring Effect */}
          {isFocused && !error && (
            <div className="absolute inset-0 rounded-xl ring-2 ring-primary/20 animate-pulse pointer-events-none" />
          )}
        </div>

        {/* Error Message or Character Count */}
        <div className="flex justify-between items-center mt-1 px-1">
          {error && <p className="text-xs text-destructive font-medium animate-fade-in">{error}</p>}
          {showCharCount && maxLength && (
            <p
              className={cn(
                'text-xs ml-auto transition-colors',
                isOverLimit ? 'text-destructive font-semibold' : 'text-muted-foreground'
              )}
            >
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
