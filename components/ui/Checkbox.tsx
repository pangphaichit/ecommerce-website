import type React from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: boolean;
  errorMsg?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      name,
      label,
      checked,
      onChange,
      error,
      errorMsg,
      className,
      ...props
    },
    ref
  ) => {
    const errorId = name ? `${name}-error` : undefined;
    const hasError = error && errorMsg;

    return (
      <div className="flex items-start space-x-2">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={id || name}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className={cn(
              "h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-600 cursor-pointer",
              hasError && "border-red-500",
              className
            )}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError && errorId ? errorId : undefined}
            {...props}
          />
        </div>
        {label && (
          <div className="flex flex-col">
            <label
              htmlFor={id || name}
              className="text-xs lg:text-sm font-medium cursor-pointer"
            >
              {label}
            </label>
            {hasError && (
              <p
                className="text-red-500 text-xs mt-1"
                id={errorId}
                role="alert"
                aria-live="assertive"
              >
                {errorMsg}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
