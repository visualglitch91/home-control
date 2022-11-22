import { styled, css } from "../utils/styling";
import { makeServiceCall, useEntity } from "../utils/hass";
import Paper from "./Paper";
import FlexRow from "./FlexRow";
import CameraStream from "./CameraStream";
import CameraSnapshot from "./CameraSnapshot";
import PillButton from "./PillButton";

const Wrapper = styled(
  Paper,
  css`
    position: relative;
    min-height: 200px;
    overflow: hidden;

    & img,
    & video {
      width: 100%;
    }
  `
);

const Overlay = styled(
  "div",
  css`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: background 70ms linear;
  `
);

const Buttons = styled(
  FlexRow,
  css`
    padding: 8px 0;
  `
);

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
    <Wrapper>
      {online ? (
        stream ? (
          <CameraStream entityId={streamEntityId} />
        ) : (
          <CameraSnapshot entityId={streamEntityId} />
        )
      ) : (
        <Overlay>Câmera Indisponível</Overlay>
      )}
      {online && (
        <Buttons wrap>
          <PillButton icon="arrow-left" onClick={pan("LEFT")} />
          <PillButton icon="arrow-down" onClick={tilt("DOWN")} />
          <PillButton icon="arrow-up" onClick={tilt("UP")} />
          <PillButton icon="arrow-right" onClick={pan("RIGHT")} />
        </Buttons>
      )}
    </Wrapper>
  );
}
