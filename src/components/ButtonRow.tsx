import { cx } from "../utils/styling";
import classes from "./ButtonRow.module.scss";

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
      className={cx(className, classes.root)}
    >
      {children}
    </div>
  );
}
