import { makeServiceCall, useEntity } from "../utils/hass";
import Paper from "./Paper";
import FlexRow from "./FlexRow";
import CameraStream from "./CameraStream";
import CameraSnapshot from "./CameraSnapshot";
import PillButton from "./PillButton";
import classes from "./Camera.module.scss";

export default function Camera({
  stream,
  cameraName,
}: {
  stream: boolean;
  cameraName: string;
}) {
  const streamEntityId = `camera.${cameraName}_stream`;
  const onvifEntityId = `camera.${cameraName}_onvif`;

  const sensorEntity = useEntity(`binary_sensor.${cameraName}_online`);
  const online = sensorEntity?.state === "on";

  function pan(direction: "LEFT" | "RIGHT") {
    return makeServiceCall("onvif", "ptz", {
      pan: direction,
      move_mode: "ContinuousMove",
      entity_id: onvifEntityId,
    });
  }

  function tilt(direction: "UP" | "DOWN") {
    return makeServiceCall("onvif", "ptz", {
      tilt: direction,
      move_mode: "ContinuousMove",
      entity_id: onvifEntityId,
    });
  }

  return (
    <Paper className={classes.root}>
      {online ? (
        stream ? (
          <CameraStream entityId={streamEntityId} />
        ) : (
          <CameraSnapshot entityId={streamEntityId} />
        )
      ) : (
        <div className={classes.overlay}>Câmera Indisponível</div>
      )}
      {online && (
        <FlexRow wrap className={classes.buttons}>
          <PillButton icon="arrow-left" onClick={pan("LEFT")} />
          <PillButton icon="arrow-down" onClick={tilt("DOWN")} />
          <PillButton icon="arrow-up" onClick={tilt("UP")} />
          <PillButton icon="arrow-right" onClick={pan("RIGHT")} />
        </FlexRow>
      )}
    </Paper>
  );
}
