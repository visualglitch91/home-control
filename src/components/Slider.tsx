import { useDebouncedCallback } from "../utils/general";
import "./Slider.css";

function cast(value: number | undefined) {
  if (typeof value === "undefined") {
    return undefined;
  }

  return String(value);
}

function noop() {}

export default function Slider({
  value,
  defaultValue,
  onChange = noop,
  onChangeEnd = noop,
  ...props
}: {
  min: number;
  max: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onChangeEnd?: (value: number) => void;
}) {
  const debouncedOnChangeEnd = useDebouncedCallback(onChangeEnd);

  return (
    <input
      type="range"
      className="component__slider"
      {...props}
      value={cast(value)}
      defaultValue={cast(defaultValue)}
      onInput={(e) => {
        const value = Number(e.currentTarget.value);
        onChange(value);
        debouncedOnChangeEnd(value);
      }}
    />
  );
}
