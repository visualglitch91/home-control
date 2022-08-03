import { makeTurnOnCall } from "../utils/hass";
import Stack from "../components/Stack";
import ButtonRow from "../components/ButtonRow";
import TitleCard from "../components/TitleCard";
import {
  TVSwitch,
  SurroundSwitch,
  IconButtonCard,
  ImageButtonCard,
  makeTVButtonCall,
  makeTVMediaControlCall,
  makeTVLaunchAppCall,
} from "./tv.utils";
import ListCard from "../components/ListCard";
import RGBLightGroupRow from "../components/RGBLightGroupRow";
import RGBLightGroupButtons from "../components/RGBLightGroupButtons";

function spacer(height?: number) {
  return <div style={{ height: height && `${height}px` }} />;
}

export default (
  <Stack smallGap>
    <TitleCard title="TV" action={<TVSwitch />} />

    {spacer()}

    <ButtonRow height={70}>
      <IconButtonCard
        icon="mdi:image-outline"
        size={28}
        onClick={makeTurnOnCall("script.sala_tv_ligar_tela")}
      />
      <IconButtonCard
        icon="mdi:chevron-up"
        size={32}
        onClick={makeTVButtonCall("UP")}
      />
      <IconButtonCard
        icon="mdi:image-off-outline"
        size={28}
        onClick={makeTurnOnCall("script.sala_tv_desligar_tela")}
      />
    </ButtonRow>
    <ButtonRow height={70}>
      <IconButtonCard
        icon="mdi:chevron-left"
        size={32}
        onClick={makeTVButtonCall("LEFT")}
      />
      <IconButtonCard
        icon="mdi:record-circle-outline"
        size={25}
        onClick={makeTVButtonCall("ENTER")}
      />
      <IconButtonCard
        icon="mdi:chevron-right"
        size={32}
        onClick={makeTVButtonCall("RIGHT")}
      />
    </ButtonRow>
    <ButtonRow height={70}>
      <IconButtonCard
        icon="mdi:undo"
        size={30}
        onClick={makeTVButtonCall("BACK")}
      />
      <IconButtonCard
        icon="mdi:chevron-down"
        size={32}
        onClick={makeTVButtonCall("DOWN")}
      />
      <IconButtonCard
        icon="mdi:cog"
        size={25}
        onClick={makeTVButtonCall("MENU")}
      />
    </ButtonRow>

    {spacer(12)}

    <ButtonRow height={55}>
      <IconButtonCard
        icon="mdi:volume-minus"
        size={25}
        onClick={makeTurnOnCall("script.sala_volume_menos")}
      />
      <IconButtonCard
        icon="mdi:volume-off"
        size={25}
        onClick={makeTurnOnCall("script.sala_volume_mute")}
      />
      <IconButtonCard
        icon="mdi:volume-plus"
        size={25}
        onClick={makeTurnOnCall("script.sala_volume_mais")}
      />
    </ButtonRow>
    <ButtonRow height={55}>
      <IconButtonCard
        icon="mdi:rewind"
        size={25}
        onClick={makeTVMediaControlCall("rewind")}
      />
      <IconButtonCard
        icon="mdi:play"
        size={25}
        onClick={makeTVMediaControlCall("play")}
      />
      <IconButtonCard
        icon="mdi:pause"
        size={25}
        onClick={makeTVMediaControlCall("pause")}
      />
      <IconButtonCard
        icon="mdi:fast-forward"
        size={25}
        onClick={makeTVMediaControlCall("fastForward")}
      />
    </ButtonRow>

    {spacer(12)}

    <ListCard
      rows={[
        {
          label: "Surround",
          icon: "mdi:surround-sound",
          entityId: "switch.sala_receiver",
          renderContent: () => <SurroundSwitch />,
        },
        {
          type: "custom",
          render: () => (
            <RGBLightGroupRow
              label="RGB"
              icon="television-ambient-light"
              entityIds={[
                "light.sala_rgb_tv",
                "light.sala_rgb_rack",
                "light.sala_rgb_sofa",
              ]}
            />
          ),
        },
        {
          type: "custom",
          render: () => (
            <RGBLightGroupButtons
              entities={[
                { label: "TV", entityId: "light.sala_rgb_tv" },
                { label: "Rack", entityId: "light.sala_rgb_rack" },
                { label: "Sofá", entityId: "light.sala_rgb_sofa" },
              ]}
            />
          ),
        },
      ]}
    />

    {spacer(8)}

    <ButtonRow height={70}>
      <ImageButtonCard
        asset="globo"
        onClick={makeTurnOnCall("script.sala_tv_globo_ao_vivo")}
      />
      <ImageButtonCard
        asset="globoplay"
        onClick={makeTVLaunchAppCall("globoplaywebos")}
      />
      <ImageButtonCard
        asset="netflix"
        onClick={makeTVLaunchAppCall("netflix")}
      />
    </ButtonRow>

    <ButtonRow height={70}>
      <ImageButtonCard
        asset="plex"
        onClick={makeTVLaunchAppCall("com.itkey.plexclient")}
      />
      <ImageButtonCard
        asset="disneyplus"
        onClick={makeTVLaunchAppCall("com.disney.disneyplus-prod")}
      />
      <ImageButtonCard
        asset="hbomax"
        onClick={makeTVLaunchAppCall("com.hbo.hbomax")}
      />
    </ButtonRow>

    <ButtonRow height={70}>
      <ImageButtonCard
        asset="youtube"
        onClick={makeTVLaunchAppCall("youtube.leanback.v4")}
      />
      <ImageButtonCard
        asset="starplus"
        onClick={makeTVLaunchAppCall("com.disney.alch.prod.lrd.app")}
      />
      <ImageButtonCard
        asset="prime_video"
        onClick={makeTVLaunchAppCall("amazon")}
      />
    </ButtonRow>

    <ButtonRow height={70}>
      <ImageButtonCard
        asset="spotify"
        onClick={makeTVLaunchAppCall("spotify-beehive")}
      />
      <ImageButtonCard
        asset="ps5"
        onClick={makeTurnOnCall("script.sala_tv_hdmi1")}
      />
      <ImageButtonCard
        asset="switch"
        onClick={makeTurnOnCall("script.sala_receiver_nintendo_switch")}
      />
      <ImageButtonCard
        asset="retropi"
        onClick={makeTurnOnCall("script.sala_receiver_pc")}
      />
    </ButtonRow>
  </Stack>
);
