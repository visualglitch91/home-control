import { css, styled } from "../utils/styling";
import { getContrastColor, RGB } from "../utils/general";
import { colorPresets, isColorEqual } from "../utils/colorPresets";
import Icon from "./Icon";
import FlexRow from "./FlexRow";
import ColorBadge from "./ColorBadge";
import RippleButton from "./RippleButton";

const ColorPresetButton = styled(
  RippleButton,
  css`
    padding: 0;
    outline: none;
    border: 0;
    font-size: 0;
    background: transparent;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    & > i {
      position: absolute;
      left: calc(50%- 12px);
      top: calc(50%- 12px);
    }
  `
);

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
        <ColorPresetButton key={index} onClick={() => onChange(color)}>
          {selected && isColorEqual(selected, color) && (
            <Icon
              size={24}
              icon="check"
              style={{ color: getContrastColor(color) }}
            />
          )}
          <ColorBadge radius={radius} size={size} color={color} />
        </ColorPresetButton>
      ))}
    </FlexRow>
  );
}
