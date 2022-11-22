import { styled, css } from "../../utils/styling";

export const Wrapper = styled(
  "div",
  css`
    height: 100%;
    overflow: auto;
    overscroll-behavior: contain;
    touch-action: manipulation;

    .mobile-layout__fade {
      opacity: 0;
      transition: opacity 250ms cubic-bezier(0.76, 0, 0.24, 1);
    }

    .mobile-layout__fade-appear {
      opacity: 0;
    }

    .mobile-layout__fade-appear-active {
      opacity: 0;
    }

    .mobile-layout__fade-appear-done {
      opacity: 1;
    }

    .mobile-layout__fade-enter {
      opacity: 0;
    }

    .mobile-layout__fade-enter-active {
      opacity: 0;
    }

    .mobile-layout__fade-enter-done {
      opacity: 1;
    }

    .mobile-layout__fade-exit {
      opacity: 1;
    }

    .mobile-layout__fade-exit-active {
      opacity: 0;
    }

    .mobile-layout__fade-exit-done {
      opacity: 0;
    }
  `
);

export const Tabs = styled(
  "div",
  css`
    height: 60px;
    backdrop-filter: blur(10px);
    background: linear-gradient(
      to bottom,
      rgba(32, 48, 77, 0.57) 0%,
      rgba(32, 48, 77, 0.57) 34%,
      rgba(36, 50, 75, 1) 100%
    );
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    row-gap: 14px;
    color: white;
    padding: 0 14px;
    z-index: 2;
    justify-content: space-between;
  `
);

export const Content = styled(
  "div",
  css`
    padding: 16px 16px 80px;

    .cordova & {
      padding-top: 48px;
      will-change: transform;
    }
  `
);

export const StatusBar = styled(
  "div",
  css`
    .cordova & {
      height: 32px;
      backdrop-filter: blur(10px);
      background: rgb(37 51 82 / 65%);
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 2;
    }
  `
);
