import { styled, css } from "../utils/styling";
import TouchButton, { TouchButtonProps } from "./TouchButton";
import Paper from "./Paper";

export type ButtonCardProps = TouchButtonProps;

const ButtonCard = styled(
  Paper.withComponent(TouchButton),
  css`
    overflow: hidden;
    transition: all 100ms cubic-bezier(0.76, 0, 0.24, 1);
    height: 100%;
    margin: 0;
    padding: 6px;
    border: none;
    outline: none;
    font-size: 17px;
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;
    border: 1px solid transparent;

    &.hover {
      background-color: rgba(29, 41, 56, 0.7);
      box-shadow: rgb(27, 55, 80) 3px 3px 13px -6px;
    }

    &.disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  `
);

export default ButtonCard;
