import { styled, css } from "../../utils/styling";

export const Wrapper = styled(
  "div",
  css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 180ms cubic-bezier(0.76, 0, 0.24, 1);
    backdrop-filter: blur(10px);
    will-change: opacity;
    opacity: 0;
    z-index: 2;

    body.mobile & {
      align-items: flex-end;
      transition: opacity 400ms cubic-bezier(0.76, 0, 0.24, 1);
      transform: translate3d(0, 0, 0);
    }

    .modal-transition-enter & {
      opacity: 0;
    }

    .modal-transition-enter-active & {
      opacity: 1;
    }

    .modal-transition-enter-done & {
      opacity: 1;
    }

    .modal-transition-exit & {
      opacity: 1;
    }

    .modal-transition-exit-active & {
      opacity: 0;
    }

    .modal-transition-exit-done & {
      opacity: 0;
    }
  `
);

export const Root = styled(
  "div",
  css`
    background: #2f3b52;
    padding: 18px 18px 28px;
    min-width: 300px;
    border-radius: 6px;

    body.mobile & {
      width: 100%;
      position: relative;
      transform: translate3d(0, 100%, 0);
      transition: transform 400ms cubic-bezier(0.76, 0, 0.24, 1);
      will-change: transform;
      border-radius: 16px;
    }

    body.mobile .modal-transition-enter & {
      transform: translate3d(0, 100%, 0);
    }

    body.mobile .modal-transition-enter-active & {
      transform: translate3d(0, 0, 0);
    }

    body.mobile .modal-transition-enter-done & {
      transform: translate3d(0, 0, 0);
    }

    body.mobile .modal-transition-exit & {
      transform: translate3d(0, 0, 0);
    }

    body.mobile .modal-transition-exit-active & {
      transform: translate3d(0, 100%, 0);
    }

    body.mobile .modal-transition-exit-done & {
      transform: translate3d(0, 100%, 0);
    }
  `
);

export const Header = styled(
  "div",
  css`
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 8px;
    font-size: 18px;
  `
);

export const Content = styled(
  "div",
  css`
    display: flex;
    flex-direction: column;
  `
);
