import { css } from "../../utils/styling";

const height = "30px";
const track = "#20293c";
const filled = "#dc456c";
const thumbColor = "transparent";
const thumbWidth = "0";

export const sliderClassName = css`
  margin: auto;
  appearance: none;
  -webkit-appearance: none;
  position: relative;
  overflow: hidden;
  height: ${height};
  width: 100%;
  cursor: pointer;
  border-radius: 8px;

  &::-webkit-slider-runnable-track {
    background: ${track};
  }

  &::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: ${thumbWidth}; /* 1 */
    height: ${height};
    background: ${thumbColor};
    box-shadow: -200px 0 0 200px ${filled}; /* 2 */
    border: none;
  }

  &::-moz-range-track {
    height: ${height};
    background: ${track};
  }

  &::-moz-range-thumb {
    background: ${thumbColor};
    height: ${height};
    width: ${thumbWidth};
    border: none;
    border-radius: 0 !important;
    box-shadow: -200px 0 0 200px ${filled};
    box-sizing: border-box;
  }

  &::-ms-fill-lower {
    background: ${filled};
  }

  &::-ms-thumb {
    background: ${thumbColor};
    border: none;
    height: ${height};
    width: ${thumbWidth};
    box-sizing: border-box;
  }

  &::-ms-ticks-after {
    display: none;
  }

  &::-ms-ticks-before {
    display: none;
  }

  &::-ms-track {
    background: ${track};
    color: transparent;
    height: ${height};
    border: none;
  }

  &::-ms-tooltip {
    display: none;
  }
`;
