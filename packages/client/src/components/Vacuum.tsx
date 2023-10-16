import { ButtonGroup, Button, List, Stack } from "@mui/material";
import { makeServiceCall, useEntity } from "../utils/hass";
import ListItem from "./ListItem";
import RunScriptButton from "./RunScriptButton";
import EntitiesSwitch from "./EntitiesSwitch";
import EntityListItem, { EntityListItems } from "./EntityListItem";
import GlossyPaper from "./GlossyPaper";
import Icon from "./Icon";
import AltIconButton from "./AltIconButton";

const vacuumId = "vacuum.mi_robot_vacuum_mop_p";

const statusLabels = {
  cleaning: "Limpando",
  docked: "Na Base",
  paused: "Pausado",
  idle: "Parado",
  returning: "Voltando",
  error: "Erro",
};

function makeVacuumCall(action: string) {
  return makeServiceCall("vacuum", action, { entity_id: vacuumId });
}

function VacuumActionsRow() {
  const vacuum = useEntity(vacuumId);
  const state = vacuum?.state;

  if (state && ["docked", "idle"].includes(state)) {
    const clean = (
      <ListItem
        icon="mdi:robot-vacuum"
        primaryText="Aspirar áreas selecionadas"
        endSlot={
          <RunScriptButton entityId="script.vacuum_clean_selected_zones">
            Aspirar
          </RunScriptButton>
        }
      />
    );

    if (state === "docked") {
      return clean;
    }

    return (
      <>
        {clean}
        <ListItem
          icon="mdi:robot-vacuum"
          primaryText="Retornar para a base"
          endSlot={
            <Button onClick={makeVacuumCall("return_to_base")}>Retornar</Button>
          }
        />
      </>
    );
  }

  return (
    <ButtonGroup sx={{ margin: "4px auto 8px" }}>
      <AltIconButton onClick={makeVacuumCall("start")}>
        <Icon icon="mdi:play" />
      </AltIconButton>
      <AltIconButton onClick={makeVacuumCall("pause")}>
        <Icon icon="mdi:pause" />
      </AltIconButton>
      <AltIconButton onClick={makeVacuumCall("stop")}>
        <Icon icon="mdi:stop" />
      </AltIconButton>
      <AltIconButton onClick={makeVacuumCall("return_to_base")}>
        <Icon icon="mdi:home" />
      </AltIconButton>
    </ButtonGroup>
  );
}

const booleanInputs = [
  { label: "Cozinha", entityId: "input_boolean.vacuum_cozinha" },
  { label: "Sala Jantar", entityId: "input_boolean.vacuum_sala_jantar" },
  { label: "Sala Estar", entityId: "input_boolean.vacuum_sala_estar" },
  { label: "Escritório", entityId: "input_boolean.vacuum_escritorio" },
  { label: "Banheiro", entityId: "input_boolean.vacuum_banheiro" },
  { label: "Quarto", entityId: "input_boolean.vacuum_quarto" },
];

export default function Vacuum() {
  return (
    <Stack spacing={3}>
      <List component={GlossyPaper}>
        <EntityListItem
          label="Status"
          entityId={vacuumId}
          renderListContent={(entity) => {
            const status = entity.attributes
              .status as keyof typeof statusLabels;
            return statusLabels[status] || "Desconhecido";
          }}
        />

        <EntityListItem
          label="Bateria"
          icon="battery-50"
          entityId={vacuumId}
          renderListContent={(entity) => `${entity.attributes.battery_level}%`}
        />
        <VacuumActionsRow />
      </List>
      <List component={GlossyPaper}>
        <EntityListItems
          items={[
            {
              label: "Todos",
              entityId: vacuumId,
              renderListContent: () => (
                <EntitiesSwitch
                  condition="every"
                  entityIds={booleanInputs.map((it) => it.entityId)}
                />
              ),
            },
            ...booleanInputs,
          ]}
        />
      </List>
    </Stack>
  );
}
