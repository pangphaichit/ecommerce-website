import { ChangeEvent } from "react";

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
