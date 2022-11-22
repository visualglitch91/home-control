import useAsyncChange from "../utils/useAsyncChange";
import { cx } from "../utils/styling";
import Icon from "./Icon";
import { ButtonCardProps } from "./ButtonCard";
import CircularLoading from "./CircularLoading";
import ButtonCard from "./ButtonCard";
import classes from "./BaseEntityButton.module.scss";

export default function BaseEntityButton({
  icon,
  label,
  unavailable,
  checked,
  backgroundColor,
  changeTimeout = 0,
  onTap,
  ...props
}: Pick<ButtonCardProps, "onTap" | "onPress" | "onHold" | "onDoubleTap"> & {
  icon?: string;
  label?: string;
  unavailable?: boolean;
  checked?: boolean;
  backgroundColor?: string;
  changeTimeout?: number;
}) {
  const { changing, change } = useAsyncChange({
    flag: checked || false,
    timeout: changeTimeout,
  });

  return (
    <ButtonCard
      {...props}
      disabled={unavailable}
      className={cx(
        classes.root,
        backgroundColor && !changing && classes.rootCustomBG,
        checked && !changing && classes.rootActive
      )}
      style={backgroundColor && !changing ? { backgroundColor } : undefined}
      onTap={() => {
        if (change() && onTap) {
          onTap();
        }
      }}
    >
      {changing ? (
        <CircularLoading />
      ) : (
        <>
          <Icon icon={unavailable ? "cancel" : icon || "cancel"} />
          <div className={classes.label}>{label}</div>
        </>
      )}
    </ButtonCard>
  );
}
