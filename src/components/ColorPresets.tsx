import { getContrastColor, RGB } from "../utils/general";
import { colorPresets, isColorEqual } from "../utils/colorPresets";
import Icon from "./Icon";
import FlexRow from "./FlexRow";
import ColorBadge from "./ColorBadge";
import RippleButton from "./RippleButton";
import classes from "./ColorPresets.module.scss";

export default function ColorPresets({
  className,
  radius = 4,
  size = 42,
  selected,
  onChange,
}: {
  className?: string;
  selected?: RGB;
  radius?: number;
  size?: number;
  onChange: (color: RGB) => void;
}) {
  return (
    <FlexRow wrap className={className}>
      {colorPresets.map((color, index) => (
        <RippleButton
          key={index}
          className={classes.button}
          onClick={() => onChange(color)}
        >
          {selected && isColorEqual(selected, color) && (
            <Icon
              size={24}
              icon="check"
              style={{ color: getContrastColor(color) }}
            />
          )}
          <ColorBadge radius={radius} size={size} color={color} />
        </RippleButton>
      ))}
    </FlexRow>
  );
}
