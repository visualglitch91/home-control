import { HassEntity } from "home-assistant-js-websocket";
import { SxProps, Button, Switch } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useEntity, getIcon, makeServiceCall } from "../utils/hass";
import useModal from "../utils/useModal";
import { rgbToHex } from "../utils/colors";
import ListItem from "./ListItem";
import LightEntityDialog from "./LightEntityDialog";
import ColorBadge from "./ColorBadge";
import useAsyncChange from "../utils/useAsyncChange";
import Icon from "./Icon";
import DotLoading from "./DotLoading";

interface Props {
  icon?: string | React.ReactNode;
  label?: React.ReactNode;
  changeTimeout?: number;
  entityId: string;
  confirmBefore?: boolean;
  sx?: SxProps;
  renderListContent?: (entity: HassEntity) => React.ReactNode;
}

function BaseEntityListItem({
  sx,
  icon: customIcon,
  label: _label,
  changeTimeout = 0,
  confirmBefore,
  entity,
  entityId,
  renderListContent,
}: Props & { entity: HassEntity }) {
  const icon = customIcon || getIcon(entity);
  const [mount, modals] = useModal();
  const confirm = useConfirm();

  function onLightClick() {
    mount((_, props) => (
      <LightEntityDialog title={label} entityId={entity.entity_id} {...props} />
    ));
  }

  const { state, attributes } = entity;
  const { friendly_name: friendlyName } = attributes;
  const [domain] = entityId.split(".");
  const checked = state === "on";
  const unavailable = state === "unavailable";

  const label =
    _label || friendlyName?.replace(/\[[^()]*\]/g, "").trim() || entityId;

  const onPrimaryAction = makeServiceCall(
    "homeassistant",
    checked ? "turn_off" : "turn_on",
    { entity_id: entityId }
  );

  const { changing, change } = useAsyncChange({
    flag: checked || false,
    timeout: changeTimeout,
  });

  const customProps = renderListContent
    ? { endSlot: renderListContent(entity) }
    : ["light", "switch", "input_boolean"].includes(domain)
    ? {
        endSlot:
          typeof checked === "boolean" ? (
            unavailable ? (
              <Icon icon="cancel" />
            ) : changing ? (
              <DotLoading />
            ) : (
              <Switch
                checked={checked}
                onChange={() => {
                  if (change()) {
                    onPrimaryAction();
                  }
                }}
              />
            )
          ) : null,
      }
    : domain === "script"
    ? {
        endSlot: (
          <Button
            onClick={
              onPrimaryAction
                ? () => {
                    (confirmBefore
                      ? confirm({ title: "Continuar?" })
                      : Promise.resolve()
                    ).then(onPrimaryAction);
                  }
                : undefined
            }
          >
            Executar
          </Button>
        ),
      }
    : { endSlot: entity.state };

  const colorBadge = attributes.rgb_color && rgbToHex(attributes.rgb_color);

  return (
    <>
      {modals}
      <ListItem
        sx={sx}
        disabled={unavailable}
        icon={icon}
        primaryText={
          colorBadge ? (
            <>
              {label}
              <ColorBadge size={12} color={colorBadge} />
            </>
          ) : (
            label
          )
        }
        onClick={domain === "light" && checked ? onLightClick : undefined}
        {...customProps}
      />
    </>
  );
}

export default function EntityListItem(props: Props) {
  const { entityId, label } = props;
  const entity = useEntity(entityId);

  if (!entity) {
    return (
      <ListItem
        disabled
        icon="cancel"
        primaryText={entityId}
        endSlot={label || entityId}
      />
    );
  }

  return <BaseEntityListItem {...props} entity={entity} />;
}
