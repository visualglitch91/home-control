import { RGB, rgbToHex } from "../utils/general";
import { callService, useEntities } from "../utils/hass";
import useModal from "../utils/useModal";
import FlexRow from "./FlexRow";
import PillButton from "./PillButton";
import LightDialog from "./LightDialog";
import ColorBadge from "./ColorBadge";

export default function RGBLightGroupButton({
  entities: config,
}: {
  entities: { label: string; entityId: string }[];
}) {
  const states = useEntities(...config.map((it) => it.entityId));
  const [mount, dialogs] = useModal();

  const entities = config.reduce(
    (acc, it) => {
      const entity = states[it.entityId];

      if (!entity) {
        return acc;
      }

      const { state, attributes: attrs } = entity;
      const on = state === "on";

      return [
        ...acc,
        {
          ...it,
          on,
          brightness: (typeof attrs?.brightness === "undefined"
            ? 100
            : attrs?.brightness) as number,
          color: (typeof attrs?.rgb_color === "undefined"
            ? [255, 255, 255]
            : attrs?.rgb_color) as RGB,
        },
      ];
    },
    [] as {
      label: string;
      entityId: string;
      on: boolean;
      brightness: number;
      color: RGB;
    }[]
  );

  if (!entities.some((it) => it.on)) {
    return null;
  }

  type Entities = typeof entities;

  const multiple = entities.length > 1;

  const uniqueColor = multiple
    ? entities.reduce((acc, entity) => {
        if (acc && acc.join(",") === entity.color.join(",")) {
          return acc;
        }

        return undefined;
      }, entities[0].color as RGB | undefined)
    : undefined;

  function onColorChange(entities: Entities, color: RGB) {
    entities.forEach(({ entityId }) => {
      callService("light", "turn_on", {
        entity_id: entityId,
        rgb_color: color,
      });
    });
  }

  function onBrightnessChange(entities: Entities, brightness: number) {
    entities.forEach(({ entityId }) => {
      callService("light", "turn_on", {
        entity_id: entityId,
        brightness,
      });
    });
  }

  function onLightClick(entities: Entities, label?: string) {
    const initialColor = entities[0].color;
    const initialBrightness = entities[0].brightness;

    mount((unmount) => (
      <LightDialog
        title={label || entities[0].label}
        initialMode="color"
        features={{
          color: {
            initialValue: initialColor,
            onChange: (value) => onColorChange(entities, value),
          },
          brightness: {
            initialValue: initialBrightness,
            onChange: (value) => onBrightnessChange(entities, value),
          },
        }}
        onClose={unmount}
      />
    ));
  }

  return (
    <>
      {dialogs}
      <FlexRow align="right">
        {entities.map((it) => (
          <PillButton
            key={it.entityId}
            label={
              <>
                {!uniqueColor && it.on && (
                  <ColorBadge
                    color={rgbToHex(it.color)}
                    style={{ marginTop: -2 }}
                  />
                )}
                {it.label}
              </>
            }
            onClick={() => onLightClick([it])}
          />
        ))}
        {multiple && (
          <PillButton
            label={
              <>
                {uniqueColor && (
                  <ColorBadge
                    color={rgbToHex(uniqueColor)}
                    style={{ marginTop: -2 }}
                  />
                )}
                Todos
              </>
            }
            onClick={() => onLightClick(entities, "Todos")}
          />
        )}
      </FlexRow>
    </>
  );
}
