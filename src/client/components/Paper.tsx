import { styled } from "@mui/joy";

const Paper = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: "rgba(47, 59, 82,0.6)",
  boxShadow: "rgb(25, 25, 25) 3px 3px 13px -6px",
  borderRadius: "16px",
  color: "white",
  "body.touch-device &": { backdropFilter: "none" },
}));

export default Paper;