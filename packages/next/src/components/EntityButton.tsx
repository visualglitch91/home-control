import { getIcon, useEntity, callService } from "../utils/hass";
import { lightSupportsColor } from "../utils/light";
import { RGB } from "../utils/colors";
import {
  isColorEqual,
  getDisplayColor,
  getDisplayColorString,
} from "../utils/colors";
import useModal from "../utils/useModal";
import BaseEntityButton from "./BaseEntityButton";
import { SxProps } from "@mui/material";
import LightEntityDialog from "./LightEntityDialog";
// import EntityGroupDialog from "./EntityGroupDialog";

const EntityGroupDialog = (props: any) => null;

export interface EntityButtonProps {
  sx?: SxProps;
  icon?: string | React.ReactNode;
  label?: React.ReactNode;
  changeTimeout?: number;
  entityId: string;
  confirmBefore?: boolean;
  onClick?: () => void;
  onLongPress?: () => void;
}

export default function EntityButton({
  sx,
  icon: customIcon,
  label: _label,
  changeTimeout,
  entityId,
  confirmBefore,
  onClick,
  onLongPress,
}: EntityButtonProps) {
  const entity = useEntity(entityId);
  const [mount, modals] = useModal();

  if (!entity) {
    return <BaseEntityButton sx={sx} disabled label={_label || entityId} />;
  }

  const icon = customIcon || getIcon(entity);
  const { state, attributes } = entity;
  const { friendly_name: friendlyName } = attributes;
  const [domain] = entityId.split(".");

  const checked =
    domain === "cover" ? attributes.raw_state === "open" : state === "on";

  const unavailable = state === "unavailable";

  const label =
    _label || friendlyName?.replace(/\[[^()]*\]/g, "").trim() || entityId;

  const displayColor =
    domain === "light" &&
    lightSupportsColor(entity) &&
    Array.isArray(attributes.rgb_color)
      ? getDisplayColor(attributes.rgb_color as RGB)
      : attributes.color_mode === "color_temp"
      ? attributes.color_temp >
        (attributes.max_mireds + attributes.min_mireds) / 2
        ? ([255, 168, 66] as RGB)
        : ([255, 255, 255] as RGB)
      : undefined;

  const isWhite = displayColor
    ? isColorEqual(displayColor, [255, 255, 255])
    : false;

  function onLightDetails() {
    mount((_, dialogProps) => (
      <LightEntityDialog
        title={label}
        entityId={entity!.entity_id}
        {...dialogProps}
      />
    ));
  }

  function defaultOnLongPress() {
    if (domain === "light" && checked) {
      onLightDetails();
      return;
    }

    const groupedIds: undefined | string | string[] =
      entity?.attributes.entity_id;

    if (Array.isArray(groupedIds) && groupedIds.length > 0) {
      mount((unmount) => (
        <EntityGroupDialog
          title={label}
          entityIds={groupedIds}
          onClose={unmount}
        />
      ));
    }
  }

  function defaultOnClick() {
    if (domain === "cover") {
      callService("cover", checked ? "close_cover" : "open_cover", {
        entity_id: entityId,
      });
    } else {
      callService("homeassistant", checked ? "turn_off" : "turn_on", {
        entity_id: entityId,
      });
    }
  }

  return (
    <>
      {modals}
      <BaseEntityButton
        sx={sx}
        checked={checked}
        disabled={unavailable}
        icon={icon}
        label={label}
        changeTimeout={changeTimeout}
        color={
          displayColor && !isWhite
            ? getDisplayColorString(displayColor, 0.6)
            : undefined
        }
        confirmBefore={confirmBefore}
        onClick={onClick || defaultOnClick}
        onLongPress={onLongPress || defaultOnLongPress}
      />
    </>
  );
}
