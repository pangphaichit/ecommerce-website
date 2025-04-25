import type React from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  error?: boolean;
  errorMsg?: string;
  required?: boolean;
  ariaDescribedby?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      name,
      label,
      value,
      onChange,
      error,
      errorMsg,
      placeholder,
      required = true,
      ariaDescribedby,
      className,
      ...props
    },
    ref
  ) => {
    const errorId = `${name}-error`;
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
        <div
          className={`focus-within:border-yellow-600 border-2 ${
            hasError
              ? "border-gray-300 bg-red-100"
              : "border-gray-50 bg-gray-50"
          } p-2`}
        >
          <textarea
            ref={ref}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={cn(
              `w-full min-h-[80px] focus:outline-none ${
                hasError ? "bg-red-100" : "bg-gray-50"
              }`,
              className
            )}
            aria-invalid={hasError ? "true" : "false"}
            aria-required={required ? "true" : "false"}
            aria-describedby={`${hasError ? errorId : ""} ${
              ariaDescribedby || ""
            }`}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
