import { css, styled } from "../utils/styling";
import Paper from "./Paper";

const Wrapper = styled(
  Paper,
  css`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    column-gap: 8px;
  `
);

const Title = styled(
  "h2",
  css`
    margin: 0;
    font-size: 18px;
    line-height: 32px;
  `
);

export default function TitleCard({
  className,
  title,
  action,
}: {
  className?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <Wrapper className={className}>
      <Title>{title}</Title>
      {action}
    </Wrapper>
  );
}
