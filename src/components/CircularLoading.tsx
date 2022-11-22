import { styled, keyframes, css } from "../utils/styling";

const rotate = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const stroke = keyframes`
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: -124;
  }
`;

const Wrapper = styled(
  "div",
  css`
    margin: 0px auto;
    width: 30px;
    height: 30px;

    & > svg {
      animation: ${rotate} 2s linear infinite;
    }

    & > svg > circle {
      fill: none;
      stroke-width: 3px;
      animation: ${stroke} 1.5s ease-in-out infinite;
      stroke-linecap: round;
      stroke: #f64270;
    }
  `
);

export default function CircularLoading() {
  return (
    <Wrapper>
      <svg viewBox="25 25 50 50">
        <circle cx="50" cy="50" r="20" />
      </svg>
    </Wrapper>
  );
}
