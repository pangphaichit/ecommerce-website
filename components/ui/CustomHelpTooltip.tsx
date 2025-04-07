import { Tooltip, type TooltipProps, styled } from "@mui/material";
import { CircleHelp } from "lucide-react";
import { CustomHelpTooltipProps } from "../../types/ui/";

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "#71717a",
    color: "#fff",
    fontSize: "14px",
    padding: "12px 16px",
    maxWidth: "300px",
    borderRadius: "6px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
    lineHeight: 1.5,
  },
}));

const CustomHelpTooltip: React.FC<CustomHelpTooltipProps> = ({ text }) => {
  return (
    <CustomTooltip title={text} placement="right" arrow>
      <CircleHelp className="ml-2 h-4 w-4 text-yellow-600 cursor-help" />
    </CustomTooltip>
  );
};

export default CustomHelpTooltip;
