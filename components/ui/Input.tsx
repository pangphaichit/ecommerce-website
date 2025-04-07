import React, { forwardRef } from "react";
import { InputProps } from "../../types/ui/";

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      label,
      value,
      onChange,
      error,
      errorMsg,
      type = "text",
      placeholder,
      required = true,
      ariaDescribedby,
    },
    ref
  ) => {
    const errorId = `${name}-error`;
    const hasError = error && errorMsg;

    return (
      <div className="space-y-2">
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
        <div
          className={`flex items-center gap-2 focus-within:border-yellow-600 border-b-2 ${
            hasError
              ? "border-gray-300 bg-red-100"
              : "border-gray-300 bg-gray-100"
          } p-2`}
        >
          <input
            ref={ref}
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full focus:outline-none ${
              hasError ? "bg-red-100" : "bg-gray-100"
            }`}
            aria-invalid={hasError ? "true" : "false"}
            aria-required={required ? "true" : "false"}
            aria-describedby={`${hasError ? errorId : ""} ${
              ariaDescribedby || ""
            }`}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
