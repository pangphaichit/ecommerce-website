import { ChangeEvent } from "react";

//Custom Alert
export interface CustomAlertProps {
  open: boolean;
  message: string;
  type: "success" | "error";
  onClose: () => void;
  autoHideDuration?: number;
  position?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}

//Custom Help Tooltip
export interface CustomHelpTooltipProps {
  text: string;
}

//input
export interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  errorMsg: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  ariaDescribedby?: string;
}

//Loading Spinner
export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: string;
}
