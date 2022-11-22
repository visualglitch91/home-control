import { cx } from "../utils/styling";
import Icon from "./Icon";
import classes from "./ListCardRow.module.scss";

export default function ListCardRow({
  icon,
  label,
  children,
  disabled,
  onIconClick,
}: {
  icon?: string;
  children: React.ReactNode;
  label?: React.ReactNode;
  disabled?: boolean;
  onIconClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  return (
    <div className={cx(classes.root, disabled && classes.rootDisabled)}>
      {icon && (
        <div
          className={cx(
            classes.iconWrapper,
            !!onIconClick && classes.clickableIconWrapper
          )}
          onClick={onIconClick}
        >
          <Icon icon={icon} />
        </div>
      )}
      <div className={classes.label}>{label}</div>
      <div>{children}</div>
    </div>
  );
}
