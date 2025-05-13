'use client';

import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-sky-500",
  {
    variants: {
      color: {
        default:
          "border-transparent bg-neutral-900 text-neutral-50 dark:bg-neutral-800",
        secondary:
          "border-transparent bg-neutral-200 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50",
        destructive:
          "border-transparent bg-red-500 text-white dark:bg-red-900",
        warning:
          "border-transparent bg-amber-500 text-white dark:bg-amber-900",
        success:
          "border-transparent bg-green-500 text-white dark:bg-green-900",
        outline: "text-neutral-950 dark:text-neutral-50",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  color?: "default" | "secondary" | "destructive" | "warning" | "success" | "outline";
}

function Badge({ className, color, ...props }: BadgeProps) {
  return (
    <div className={badgeVariants({ color, className })} {...props} />
  )
}

export { Badge, badgeVariants } 