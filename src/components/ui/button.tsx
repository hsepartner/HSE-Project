import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Status-based variants
        expired: "bg-status-expired text-status-expired-foreground hover:bg-status-expired/90",
        urgent: "bg-status-urgent text-status-urgent-foreground hover:bg-status-urgent/90",
        warning: "bg-status-warning text-status-warning-foreground hover:bg-status-warning/90",
        valid: "bg-status-valid text-status-valid-foreground hover:bg-status-valid/90",
        inactive: "bg-status-inactive text-status-inactive-foreground hover:bg-status-inactive/90",
        // Outline status-based variants
        expiredOutline: "border border-status-expired text-status-expired bg-transparent hover:bg-status-expired/10",
        urgentOutline: "border border-status-urgent text-status-urgent bg-transparent hover:bg-status-urgent/10",
        warningOutline: "border border-status-warning text-status-warning bg-transparent hover:bg-status-warning/10",
        validOutline: "border border-status-valid text-status-valid bg-transparent hover:bg-status-valid/10",
        inactiveOutline: "border border-status-inactive text-status-inactive bg-transparent hover:bg-status-inactive/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
