import styled from "@emotion/styled";

export const Wrapper = styled("div")`
  height: 100%;
  overflow: auto;
  overscroll-behavior: contain;
  touch-action: manipulation;
`;

export const Tabs = styled("div")`
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
  }
`;

export const Content = styled("div")`
  padding: 16px 16px 80px;

  .cordova & {
    padding-top: 48px;
    will-change: transform;
  }
`;

export const StatusBar = styled("div")`
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
`;
