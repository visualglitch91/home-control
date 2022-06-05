import { h } from "../utils/preact.mjs";
import { clsx, css } from "../utils/general.mjs";

css(`
  .component__button {
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
  }

  .component__button:hover {
    box-shadow: 0 0 0 8px rgba(0, 0, 0, 0.1);
    background: rgba(0, 0, 0, 0.1);
  }
`);

export default function Button({ class: className, children, onClick }) {
  return h`
    <button type="button" class=${clsx(
      "component__button",
      className
    )} onClick=${onClick}>
      ${children}
    </button>
  `;
}
