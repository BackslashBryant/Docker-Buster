import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`
          flex h-10 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-base text-neutral-900
          ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium
          placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed
          disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950
          dark:text-white dark:placeholder:text-neutral-400 dark:focus-visible:ring-sky-500 ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input } 