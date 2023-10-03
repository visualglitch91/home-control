import { CircularProgress } from "@mui/material";
import { makeTurnOnCall, useEntity } from "../../utils/hass";
import HugeButton from "../HugeButton";
import { getAssetUrl } from "../../assets";

const imgStyle = {
  objectFit: "contain",
  height: "70%",
  width: "70%",
} as const;

const assets = {
  disneyplus: getAssetUrl("logos/disneyplus.png"),
  globo: getAssetUrl("logos/globo.png"),
  globoplay: getAssetUrl("logos/globoplay.png"),
  hbomax: getAssetUrl("logos/hbomax.png"),
  netflix: getAssetUrl("logos/netflix.png"),
  plex: getAssetUrl("logos/plex.png"),
  prime_video: getAssetUrl("logos/prime_video.png"),
  discovery_plus: getAssetUrl("logos/discovery_plus.png"),
  twitch: getAssetUrl("logos/twitch.png"),
  ps5: getAssetUrl("logos/ps5.png"),
  spotify: getAssetUrl("logos/spotify.png"),
  starplus: getAssetUrl("logos/starplus.png"),
  switch: getAssetUrl("logos/switch.png"),
  windows: getAssetUrl("logos/windows.png"),
  youtube: getAssetUrl("logos/youtube.png"),
  retropi: getAssetUrl("logos/retropi.png"),
  kodi: getAssetUrl("logos/kodi.png"),
  crunchyroll: getAssetUrl("logos/crunchyroll.png"),
};

export function ImageButtonCard({
  asset,
  // repeatOnHold,
  action,
}: {
  asset: keyof typeof assets;
  action: () => void;
  repeatOnHold?: boolean;
}) {
  // const onHold = repeatOnHold ? action : undefined;

  return (
    <HugeButton onClick={action} /*onLongPress={onHold} onHold={onHold}*/>
      <img alt="" src={assets[asset]} style={imgStyle} />
    </HugeButton>
  );
}

export function ScriptImageButtonCard({
  asset,
  script,
}: {
  asset: keyof typeof assets;
  script?: string;
}) {
  const entityId = `script.${script}`;
  const loading = useEntity(entityId)?.state === "on";

  return (
    <HugeButton onClick={makeTurnOnCall(entityId)}>
      {loading ? (
        <CircularProgress />
      ) : (
        <img alt="" src={assets[asset]} style={imgStyle} />
      )}
    </HugeButton>
  );
}
