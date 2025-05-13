import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

const toastVariants = cva(
  "rounded-md border p-4 text-sm",
  {
    variants: {
      variant: {
        default: "bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50",
        destructive:
          "border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-900 dark:text-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof toastVariants> {}

function Toast({
  className,
  variant,
  ...props
}: ToastProps) {
  return (
    <div
      className={toastVariants({ variant, className })}
      {...props}
    />
  )
}

export { Toast } 