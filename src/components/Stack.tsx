import { forwardRef } from "react";
import { cx } from "../utils/styling";
import classes from "./Stack.module.scss";

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
        classes.root,
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
