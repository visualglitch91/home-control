import { styled, css } from "../../utils/styling";

export const Wrapper = styled(
  "div",
  css`
    padding: 16px;
  `
);

export const Columns = styled(
  "div",
  css`
    width: 100%;
    display: flex;
    justify-content: center;
  `
);

export const Column = styled(
  "div",
  css`
    display: flex;
    flex-direction: column;
    padding: 0 8px;
    row-gap: 16px;
  `
);
