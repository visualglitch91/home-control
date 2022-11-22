import { css, cx } from "../utils/styling";

const buttonRowClassName = css`
  width: 100%;
  display: flex;
  grid-gap: 8px;

  & > * {
    flex: 1;
    overflow: hidden;
  }
`;

export default function ButtonRow({
  children,
  className,
  height,
}: {
  children: React.ReactNode;
  className?: string;
  height?: number;
}) {
  return (
    <div
      style={{ height: height && `${height}px` }}
      className={cx(className, buttonRowClassName)}
    >
      {children}
    </div>
  );
}
