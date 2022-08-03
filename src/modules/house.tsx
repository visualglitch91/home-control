import { makeTurnOnCall } from "../utils/hass";
import Switch from "../components/Switch";
import ListCard, { Row } from "../components/ListCard";
import RunScriptButton from "../components/RunScriptButton";
import EntitiesSwitch from "../components/EntitiesSwitch";
import { formatNumericValue } from "../utils/general";

function scriptRow(it: {
  entityId: string;
  label?: string;
  buttonLabel?: string;
  icon?: string;
}) {
  return {
    ...it,
    renderContent: () => (
      <RunScriptButton label={it.buttonLabel} entityId={it.entityId} />
    ),
  };
}

const groups: Record<string, { title: string; rows: Row[] }> = {
  living_room: {
    title: "Sala",
    rows: [
      { label: "Luz da Mesa", entityId: "switch.sala_luz_mesa" },
      { label: "Luz da Sala", entityId: "switch.sala_luz" },
      { label: "Luminária", entityId: "switch.sala_luminaria" },
      { label: "RGB TV", entityId: "light.sala_rgb_tv" },
      { label: "RGB Rack", entityId: "light.sala_rgb_rack" },
      { label: "RGB Sofá", entityId: "light.sala_rgb_sofa" },
    ],
  },
  office: {
    title: "Escritório",
    rows: [
      { label: "Luz", entityId: "switch.escritorio_luz" },
      { label: "Ventilador", entityId: "switch.escritorio_ventilador" },
      { label: "Luminária", entityId: "light.escritorio_luminaria" },
      { label: "RGB Mesa", entityId: "light.escritorio_rgb" },
      { label: "RGB Quadro", entityId: "light.escritorio_rgb_2" },
    ],
  },
  kitchen: {
    title: "Cozinha e Lavanderia",
    rows: [
      { label: "Luz da Cozinha", entityId: "switch.cozinha_luz" },
      { label: "Luz da Lavanderia", entityId: "switch.lavanderia_luz" },
      {
        icon: "mdi:water",
        label: "Bateria do Sensor de Vazamento",
        entityId: "sensor.lavanderia_sensor_vazamento_bateria",
        renderContent: (entity) => formatNumericValue(entity.state, "%"),
      },
    ],
  },
  bedroom: {
    title: "Quarto",
    rows: [
      { label: "Aquecedor", entityId: "switch.quarto_aquecedor" },
      { label: "Umidificador", entityId: "switch.quarto_umidificador" },
      { label: "Ventilador", entityId: "switch.quarto_ventilador" },
      { label: "Luz", entityId: "switch.quarto_luz" },
      { label: "Abajur Esquerdo", entityId: "switch.quarto_abajur_esquerdo" },
      { label: "Abajur Direito", entityId: "switch.quarto_abajur_direito" },
      { label: "Sacada", entityId: "switch.sacada_luz" },
    ],
  },
  bathroom: {
    title: "Banheiro",
    rows: [
      {
        label: "Luzes",
        entityId: "switch.banheiro_luz",
        renderContent: () => (
          <EntitiesSwitch
            entityIds={["switch.banheiro_luz", "light.banheiro_luz_chuveiro"]}
          />
        ),
      },
      {
        icon: "shower-head",
        label: "Luz do Chuveiro",
        entityId: "light.banheiro_luz_chuveiro",
        renderContent: () => (
          <RunScriptButton
            label="Luz Quente"
            entityId="script.banheiro_luz_quente_no_chuveiro"
          />
        ),
      },
    ],
  },
  shortcuts: {
    title: "Atalhos",
    rows: [
      {
        label: "Impressora 3D",
        entityId: "switch.impressora_3d",
        renderContent: (entity) =>
          entity.state === "on" ? (
            "Ligada"
          ) : (
            <Switch
              checked={false}
              onInput={makeTurnOnCall("switch.impressora_3d")}
            />
          ),
      },
      ...[
        {
          label: "Apagar todas as luzes",
          entityId: "script.casa_apagar_todas_luzes",
        },
        {
          label: "Apagar luzes, menos da sala",
          entityId: "script.casa_apagar_todas_luzes_menos_sala",
        },
        {
          label: "Iluminação abajures",
          entityId: "script.quarto_iluminacao_abajures",
        },
      ].map(scriptRow),
    ],
  },
  mobilePhones: {
    title: "Celulares",
    rows: [
      {
        label: "Lais",
        buttonLabel: "Encontrar",
        entityId: "script.encontrar_celular_lais",
      },
      {
        label: "Erica",
        buttonLabel: "Encontrar",
        entityId: "script.encontrar_celular_erica_1",
      },
      {
        label: "Erica 2",
        buttonLabel: "Encontrar",
        entityId: "script.encontrar_celular_erica_2",
      },
    ].map(scriptRow),
  },
  systemMonitor: {
    title: "Sistema",
    rows: [
      {
        icon: "icofont-thermometer",
        label: "Temperatura",
        entityId: "sensor.processor_temperature",
        renderContent: (entity) => formatNumericValue(entity.state, "°C"),
      },
      {
        label: "Processador",
        entityId: "sensor.processor_use",
        renderContent: (entity) => formatNumericValue(entity.state, "%"),
      },
      {
        label: "Memória",
        entityId: "sensor.memory_use_percent",
        renderContent: (entity) => formatNumericValue(entity.state, "%"),
      },
    ],
  },
};

let key = 0;

export default [
  <ListCard key={key++} showGroupSwitch {...groups.living_room} />,
  <ListCard key={key++} showGroupSwitch {...groups.office} />,
  <ListCard key={key++} showGroupSwitch {...groups.kitchen} />,
  <ListCard key={key++} showGroupSwitch {...groups.bedroom} />,
  <ListCard key={key++} {...groups.bathroom} />,
  <ListCard key={key++} {...groups.mobilePhones} />,
  <ListCard key={key++} {...groups.shortcuts} />,
  <ListCard key={key++} {...groups.systemMonitor} />,
];
