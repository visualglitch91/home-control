import { uid } from "../../utils/general";
import { styled, css } from "../../utils/styling";

export const classes = {
  wrapperDisabled: uid(),
  clickableIconWrapper: uid(),
};

export const Wrapper = styled(
  "div",
  css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    column-gap: 12px;

    &.${classes.wrapperDisabled} {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `
);

export const IconWrapper = styled(
  "div",
  css`
    font-size: 24px;
    min-width: 40px;
    max-width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.${classes.clickableIconWrapper} {
      cursor: pointer;
      border-radius: 100%;
      transition: background 100ms linear;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  `
);

export const Label = styled(
  "div",
  css`
    margin-right: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
    column-gap: 8px;
  `
);
