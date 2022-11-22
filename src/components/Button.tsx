import { styled, css } from "../utils/styling";
import TouchButton from "./TouchButton";

const Button = styled(
  TouchButton,
  css`
    height: 100%;
    margin: 0;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: #f64270;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 60ms linear, box-shadow 60ms linear;
    border-radius: 3px;
    font-weight: bolder;
    text-transform: uppercase;
    padding: 6px 8px;
    border-radius: 4px;

    &.hover {
      background: rgba(0, 0, 0, 0.1);
    }
  `
);

export default Button;
