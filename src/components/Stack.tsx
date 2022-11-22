import { forwardRef } from "react";
import { css, cx } from "../utils/styling";

const classes = {
  wrapper: css`
    display: flex;
    grid-gap: 16px;
  `,
  horizontal: css`
    flex-direction: row;
    & > * {
      flex: 1;
    }
  `,
  vertical: css`
    flex-direction: column;
  `,
  smallGap: css`
    grid-gap: 8px;
  `,
};

const Stack = forwardRef(function Stack(
  {
    className,
    horizontal,
    smallGap,
    children,
    title,
  }: {
    className?: string;
    horizontal?: boolean;
    smallGap?: boolean;
    children: React.ReactNode;
    title?: string;
  },
  ref: React.LegacyRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      title={title}
      className={cx(
        classes.wrapper,
        horizontal && classes.horizontal,
        !horizontal && classes.vertical,
        smallGap && classes.smallGap,
        className
      )}
    >
      {children}
    </div>
  );
});

export default Stack;
