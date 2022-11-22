import { styled, keyframes, css } from "../utils/styling";

const animation = keyframes`
  0% {
    background-color: #f64270;
  }
  50%,
  100% {
    background-color: rgba(248, 79, 172, 0.2);
  }
`;

const Wrapper = styled(
  "div",
  css`
    width: 40px;
    display: inline-flex;
    justify-content: center;

    & > div {
      position: relative;
      width: 10px;
      height: 10px;
      border-radius: 5px;
      background-color: #f64270;
      color: #f64270;
      animation: ${animation} 1s infinite linear alternate;
      animation-delay: 0.5s;

      &::before {
        left: -15px;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: #f64270;
        color: #f64270;
        animation: ${animation} 1s infinite alternate;
        animation-delay: 0s;
      }

      &::before,
      &::after {
        content: "";
        display: inline-block;
        position: absolute;
        top: 0;
      }

      &::after {
        left: 15px;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: #f64270;
        color: #f64270;
        animation: ${animation} 1s infinite alternate;
        animation-delay: 1s;
      }
    }
  `
);

export default function DotLoading() {
  return (
    <Wrapper>
      <div />
    </Wrapper>
  );
}
