import { cx } from "../utils/styling";
import classes from "./FlexRow.module.scss";

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
        classes.root,
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
