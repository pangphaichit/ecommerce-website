import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

function cn(...classNames: (string | undefined | false | null)[]): string {
  return classNames.filter(Boolean).join(" ");
}

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        secondary:
          "border-transparent bg-gray-100 text-black hover:bg-gray-200",
        destructive:
          "border-transparent bg-red-100 text-red-700 hover:bg-red-200",
        outline: "border border-gray-300 text-black hover:bg-gray-100",
        success:
          "border-transparent bg-green-100 text-green-700 hover:bg-green-200",
        warning:
          "border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  children,
  ...props
}) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
};

export default Badge;
