import { css, cx } from "../utils/styling";

const classes = {
  wrapper: css`
    display: flex;
    grid-gap: 8px;
    justify-content: center;
  `,
  full: css`
    width: 100%;
  `,
  wrap: css`
    flex-wrap: wrap;
  `,
  left: css`
    justify-content: flex-start;
  `,
  right: css`
    justify-content: flex-end;
  `,
};

export default function FlexRow({
  className,
  align = "center",
  wrap,
  full,
  children,
}: {
  className?: string;
  align?: "left" | "center" | "right";
  wrap?: boolean;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cx(
        classes.wrapper,
        align === "left" && classes.left,
        align === "right" && classes.right,
        wrap && classes.wrap,
        full && classes.full,
        className
      )}
    >
      {children}
    </div>
  );
}
