import React from "react";
import { Alert, Snackbar } from "@mui/material";
import { CustomAlertProps } from "../../types/ui/";

const CustomAlert: React.FC<CustomAlertProps> = ({
  open,
  message,
  type,
  onClose,
  autoHideDuration = 5000,
  position = { vertical: "bottom", horizontal: "right" },
}) => {
  return (
    <Snackbar
      open={open}
      anchorOrigin={position}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      aria-live="assertive"
      aria-atomic="true"
    >
      <Alert
        onClose={onClose}
        severity={type}
        sx={{
          width: {
            xs: "100%",
            lg: "400px",
          },
          borderBottom: {
            xs: `3px solid ${type === "success" ? "green" : "red"}`,
            lg: `5px solid ${type === "success" ? "green" : "red"}`,
          },
          padding: {
            xs: "8px",
            lg: "16px",
          },
          fontSize: {
            xs: "14px",
            lg: "18px",
          },
        }}
        aria-live="assertive"
        aria-atomic="true"
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
