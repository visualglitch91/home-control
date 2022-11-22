import { uid } from "../../utils/general";
import { css, styled } from "../../utils/styling";
import ButtonCard from "../ButtonCard";

export const classes = {
  wrapperActive: uid(),
  wrapperCustomBG: uid(),
};

export const Wrapper = styled(
  ButtonCard,
  css`
    height: 75px;
    display: flex;
    flex-direction: column;
    row-gap: 6px;
    box-sizing: border-box;
    padding: 6px 8px;
    overflow: hidden;

    .${classes.wrapperActive}:not(.${classes.wrapperCustomBG}) {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.1);
    }

    .${classes.wrapperActive}.hover {
      background: rgba(255, 255, 255, 0.25);
    }

    .${classes.wrapperActive}.${classes.wrapperCustomBG}.hover {
      background: unset;
      filter: brightness(1.1);
      border-color: rgba(255, 255, 255, 0.1);
    }
  `
);

export const Label = styled(
  "div",
  css`
    font-size: 9px;
    font-weight: 700;
    white-space: pre-wrap;
  `
);
