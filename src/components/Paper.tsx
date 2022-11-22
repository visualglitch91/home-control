import { css, styled } from "../utils/styling";

const Paper = styled(
  "div",
  css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: rgba(47, 59, 82, 0.6);
    backdrop-filter: blur(10px);
    box-shadow: rgb(17, 35, 52) 3px 3px 13px -6px;
    border-radius: 16px;
    color: white;

    body.touch-device & {
      backdrop-filter: none;
    }
  `
);

export default Paper;
