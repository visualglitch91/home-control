import styled from "@emotion/styled";

export const Header = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px 0;
  column-gap: 8px;
`;

export const Heading = styled("h2")`
  margin: 0;
  font-size: 18px;
  line-height: 32px;
`;

export const Content = styled("div")`
  display: flex;
  flex-direction: column;
  padding: 16px 16px 16px;
  row-gap: 8px;
`;

export const Divider = styled("div")`
  height: 1px;
  background-color: rgb(36, 46, 66);
`;
