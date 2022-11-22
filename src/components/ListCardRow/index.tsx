import { cx } from "../../utils/styling";
import Icon from "../Icon";
import { IconWrapper, Label, Wrapper, classes } from "./components";

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
    <Wrapper className={cx(disabled && classes.wrapperDisabled)}>
      {icon && (
        <IconWrapper
          className={cx(!!onIconClick && classes.clickableIconWrapper)}
          onClick={onIconClick}
        >
          <Icon icon={icon} />
        </IconWrapper>
      )}
      <Label>{label}</Label>
      <div>{children}</div>
    </Wrapper>
  );
}
