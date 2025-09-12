import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-yellow-600 text-white hover:bg-yellow-700 active:scale-95",
        destructive: "bg-red-600 text-white hover:bg-red-700 active:scale-95",
        outline:
          "border border-yellow-600 text-yellow-600 bg-white hover:bg-yellow-50 hover:text-yellow-700",
        secondary:
          "bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95",
        ghost: "text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700",
        link: "text-yellow-600 underline-offset-4 hover:underline",
        neutral:
          "border border-gray-300 text-gray-700 bg-white text-gray-900 hover:bg-gray-200 active:scale-95",
        yellow:
          "bg-yellow-600 text-white hover:bg-yellow-700 hover:shadow-lg active:scale-95",
        lightyellow:
          "bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200",
        success: "bg-green-600 text-white hover:bg-green-700 active:scale-95",
        warning: "bg-amber-500 text-white hover:bg-amber-600 active:scale-95",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;
