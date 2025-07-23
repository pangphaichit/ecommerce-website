import React, { forwardRef, useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  error?: boolean;
  errorMsg?: string;
  required?: boolean;
  options: { value: string; label: string; className?: string }[];
  placeholder?: string;
  variant?: "admin" | "user";
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  ariaLabel?: string;
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
      variant = "admin",
      disabled = false,
      ariaLabel,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const hiddenSelectRef = useRef<HTMLSelectElement>(null);

    const errorId = name ? `${name}-error` : undefined;
    const hasError = error && errorMsg;
    const selectedOption = options.find((option) => option.value === value);

    const openDropdown = () => {
      if (!disabled) {
        setOpen(true);
        setFocusedIndex(-1);
      }
    };

    const closeDropdown = () => {
      setOpen(false);
      setFocusedIndex(-1);
      buttonRef.current?.focus();
    };

    const handleOptionSelect = (optionValue: string) => {
      // Create synthetic event that matches native select behavior
      const syntheticEvent = {
        target: {
          value: optionValue,
          name: name || "",
          id: name || "",
          type: "select-one",
        },
        currentTarget: {
          value: optionValue,
          name: name || "",
          id: name || "",
          type: "select-one",
        },
        type: "change",
        preventDefault: () => {},
        stopPropagation: () => {},
        persist: () => {},
      } as React.ChangeEvent<HTMLSelectElement>;

      onChange?.(syntheticEvent);
      closeDropdown();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (!open) {
            openDropdown();
          } else {
            setFocusedIndex((prev) =>
              prev < options.length - 1 ? prev + 1 : 0
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!open) {
            openDropdown();
          } else {
            setFocusedIndex((prev) =>
              prev > 0 ? prev - 1 : options.length - 1
            );
          }
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (!open) {
            openDropdown();
          } else if (focusedIndex >= 0) {
            handleOptionSelect(options[focusedIndex].value);
          }
          break;
        case "Escape":
          e.preventDefault();
          closeDropdown();
          break;
      }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          closeDropdown();
        }
      };

      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [open]);

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

        {/* Hidden select for form compatibility */}
        <select
          ref={hiddenSelectRef}
          name={name}
          value={value}
          onChange={onChange}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div
          className={cn("relative inline-block text-left w-full", className)}
          ref={dropdownRef}
          onKeyDown={handleKeyDown}
        >
          <button
            ref={buttonRef}
            type="button"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={ariaLabel || label || "Select option"}
            onClick={() => {
              if (!disabled) setOpen((prev) => !prev);
            }}
            className={cn(
              "flex items-center justify-between w-full px-3 py-3 text-left text-sm cursor-pointer rounded-md focus:outline-none focus:ring-2 transition-colors duration-200",
              hasError
                ? "bg-red-100 border border-red-300"
                : variant === "admin"
                ? "bg-gray-50 border border-gray-200"
                : "bg-white border border-yellow-300",
              "focus:ring-yellow-600 focus:border-transparent",
              disabled && "opacity-50 cursor-not-allowed",
              !disabled && "hover:bg-opacity-80"
            )}
            aria-invalid={hasError ? "true" : "false"}
            aria-required={required ? "true" : "false"}
            aria-describedby={hasError && errorId ? errorId : undefined}
          >
            <span className="truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={cn(
                "ml-2 h-4 w-4 text-yellow-600 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </button>

          {open && (
            <div
              className="absolute left-0 mt-2 w-full rounded-md bg-white shadow-lg border border-yellow-200 z-50 max-h-60 overflow-auto"
              role="listbox"
              aria-label="Select options"
            >
              <ul ref={listRef} className="py-1 m-0 list-none" role="none">
                {options.map((option, index) => (
                  <li key={option.value} role="none">
                    <button
                      type="button"
                      onClick={() => handleOptionSelect(option.value)}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm transition-colors duration-150 cursor-pointer",
                        "hover:bg-yellow-50 hover:text-yellow-700 focus:outline-none",
                        option.value === value
                          ? "bg-yellow-100 font-semibold text-yellow-700"
                          : "font-normal text-gray-900",
                        focusedIndex === index &&
                          "bg-yellow-50 text-yellow-700",
                        option.className
                      )}
                      role="option"
                      aria-selected={option.value === value}
                      tabIndex={-1}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
