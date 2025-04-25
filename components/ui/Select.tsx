import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: boolean;
  errorMsg?: string;
  required?: boolean;
  options: { value: string; label: string; className?: string }[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      name,
      label,
      value,
      onChange,
      error,
      errorMsg,
      required = true,
      options,
      className,
      placeholder = "Select an option",
      ...props
    },
    ref
  ) => {
    const errorId = name ? `${name}-error` : undefined;
    const hasError = error && errorMsg;

    return (
      <div className="space-y-2">
        {label && (
          <div className="flex flex-row justify-between">
            <label
              htmlFor={name}
              className="block text-xs lg:text-sm font-medium"
            >
              {label}
              {required && (
                <span className="text-red-500 ml-1" aria-hidden="true">
                  *
                </span>
              )}
            </label>
            {hasError && (
              <p
                className="text-red-500 text-xs lg:text-sm flex items-center"
                id={errorId}
                role="alert"
                aria-live="assertive"
              >
                {errorMsg}
              </p>
            )}
          </div>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={cn(
              "w-full px-3 py-2 pr-8 rounded-md text-sm cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent",
              hasError ? "bg-red-100" : "bg-gray-50",
              className
            )}
            aria-invalid={hasError ? "true" : "false"}
            aria-required={required ? "true" : "false"}
            aria-describedby={hasError && errorId ? errorId : undefined}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className={option.className}
              >
                {option.label}
              </option>
            ))}
          </select>
          {/* Custom arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
