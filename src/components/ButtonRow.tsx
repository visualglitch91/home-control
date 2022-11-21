import { styled } from "../utils/styling";

const ButtonRow = styled("div")<{ height?: number }>`
  width: 100%;
  display: flex;
  grid-gap: 8px;
  height: ${(p) =>
    typeof p.height === "number" ? `${p.height}px` : "undefined"};

  & > * {
    flex: 1;
    overflow: hidden;
  }
`;

export default ButtonRow;
