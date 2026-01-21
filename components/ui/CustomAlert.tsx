import React from "react";
import { Alert, Snackbar } from "@mui/material";
import { AlertItem } from "../../types/ui/";

interface CustomAlertProps {
  alerts: AlertItem[] | AlertItem;
  onClose: (id: number) => void;
  autoHideDuration?: number;
  position?: {
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
  };
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  alerts = [],
  onClose,
  autoHideDuration = 3000,
  position = { vertical: "bottom", horizontal: "right" },
}) => {
  const alertArray = Array.isArray(alerts) ? alerts : [alerts];

  return (
    <>
      {alertArray.map((alert, index) => (
        <Snackbar
          key={alert.id}
          open={true}
          anchorOrigin={position}
           onClose={() => onClose(alert.id)}
          autoHideDuration={autoHideDuration}
          aria-live="assertive"
          aria-atomic="true"
          style={{ marginBottom: `${index * 75}px` }}
        >
          <Alert
            onClose={() => onClose(alert.id)}
            severity={alert.type}
            sx={{
              width: {
                xs: "100%",
                lg: "400px",
              },
              borderBottom: {
                xs: `3px solid ${alert.type === "success" ? "green" : "red"}`,
                lg: `5px solid ${alert.type === "success" ? "green" : "red"}`,
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
            {alert.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default CustomAlert;
