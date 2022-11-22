import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback, RGB } from "../../utils/general";
import Icon from "../Icon";
import DialogBase from "../DialogBase";
import ColorWheel from "../ColorWheel";
import Slider from "../Slider";
import FlexRow from "../FlexRow";
import { Tab, Content, StyledColorPresets, Tabs, classes } from "./components";
import { cx } from "../../utils/styling";

export interface LightDialogFeatures {
  brightness: {
    initialValue: number;
    onChange: (value: number) => void;
  };
  temperature: {
    min: number;
    max: number;
    initialValue: number;
    onChange: (value: number) => void;
  };
  color: {
    initialValue: RGB;
    onChange: (value: RGB) => void;
  };
}

export default function LightDialog({
  title,
  initialMode,
  features,
  onModeChange = () => {},
  onClose,
}: {
  title?: string;
  features: Partial<LightDialogFeatures>;
  initialMode: "temperature" | "color";
  onModeChange?: (mode: "temperature" | "color") => void;
  onClose: () => void;
}) {
  const onCloseRef = useRef(onClose);
  const featuresRef = useRef(features);
  const [mode, setMode] = useState(initialMode);

  const [selectedColor, setSelectedColor] = useState(
    features.color?.initialValue
  );

  const onChange = useDebouncedCallback(
    <K extends keyof LightDialogFeatures, F extends LightDialogFeatures[K]>(
      key: K,
      value: F["initialValue"]
    ) => {
      const feature = featuresRef.current[key];

      if (feature) {
        //@ts-expect-error just ignore this
        feature.onChange(value);
      }
    }
  );

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    window.location.hash = "light-dialog";

    function onHashChange() {
      onCloseRef.current();
    }

    setTimeout(() => {
      window.addEventListener("hashchange", onHashChange);
    }, 10);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DialogBase title={title} onClose={onClose}>
      <Content>
        {features.temperature && features.color && (
          <Tabs>
            {(
              [
                { key: "color", label: "Cor" },
                { key: "temperature", label: "Frio/Quente" },
              ] as const
            ).map((it) => (
              <Tab
                key={it.key}
                className={cx(mode === it.key && classes.tabActive)}
                onTap={() => {
                  setMode(it.key);
                  onModeChange(it.key);
                }}
              >
                {it.label}
              </Tab>
            ))}
          </Tabs>
        )}
        {features.brightness ? (
          <FlexRow full>
            <Icon icon="mdi:brightness-5" />
            <Slider
              min={0}
              max={255}
              defaultValue={features.brightness.initialValue || 0}
              onChangeEnd={(value) => onChange("brightness", value)}
            />
          </FlexRow>
        ) : null}
        {mode === "temperature" && features.temperature ? (
          <FlexRow full>
            <Icon icon="icofont-thermometer" />
            <Slider
              min={features.temperature.min}
              max={features.temperature.max}
              defaultValue={features.temperature.initialValue || 0}
              onChangeEnd={(value) => onChange("temperature", value)}
            />
          </FlexRow>
        ) : null}
        {mode === "color" && features.color && (
          <>
            <ColorWheel
              selected={selectedColor}
              onChangeEnd={(color) => {
                setSelectedColor(color);
                onChange("color", color);
              }}
            />
            <StyledColorPresets
              radius={8}
              size={46}
              selected={selectedColor}
              onChange={(color) => {
                setSelectedColor(color);
                onChange("color", color);
              }}
            />
          </>
        )}
      </Content>
    </DialogBase>
  );
}
