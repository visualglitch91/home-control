import useAsyncChange from "../../utils/useAsyncChange";
import { cx } from "../../utils/styling";
import Icon from "../Icon";
import { ButtonCardProps } from "../ButtonCard";
import CircularLoading from "../CircularLoading";
import { Label, Wrapper, classes } from "./components";

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
    <Wrapper
      {...props}
      disabled={unavailable}
      className={cx(
        backgroundColor && !changing && classes.wrapperCustomBG,
        checked && !changing && classes.wrapperActive
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
          <Label>{label}</Label>
        </>
      )}
    </Wrapper>
  );
}
