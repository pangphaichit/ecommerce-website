import CircularProgress from "@mui/material/CircularProgress";
import { LoadingSpinnerProps } from "../../types/ui/";

const LoadingSpinner = ({
  size = "md",
  className,
  color = "#2979ff",
}: LoadingSpinnerProps) => {
  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 56,
  };

  return (
    <CircularProgress
      size={sizeMap[size]}
      className={className}
      sx={{
        color: color,
        "& .MuiCircularProgress-circle": {
          strokeLinecap: "round",
        },
      }}
    />
  );
};

export default LoadingSpinner;
