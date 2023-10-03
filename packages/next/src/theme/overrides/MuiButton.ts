import { ComponentOverride } from "../utils";

const MuiButton: ComponentOverride["MuiButton"] = {
  styleOverrides: {
    root: {
      borderRadius: "12px",
      "&.MuiButton-containedGlossy": { color: "white" },
      "&.MuiButton-outlinedGlossy": { color: "white" },
    },
  },
  defaultProps: {
    variant: "outlined",
  },
};

export default MuiButton;