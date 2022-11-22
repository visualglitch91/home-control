import { cx } from "../utils/styling";
import Icon from "./Icon";
import classes from "./PillButton.module.scss";

export default function PillButton({
  className,
  icon,
  label,
  onClick,
}: {
  className?: string;
  icon?: string;
  label?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cx(className, classes.root)}
      onClick={onClick}
    >
      {icon && <Icon size={14} icon={icon} />}
      {label}
    </button>
  );
}
