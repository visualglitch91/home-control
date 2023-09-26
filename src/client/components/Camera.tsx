import { useEffect, useState } from "react";
import { CircularProgress, styled } from "@mui/joy";
import { hassUrl, useEntity } from "../utils/hass";
import Paper from "./Paper";
import FullScreenCamera from "./FullScreenCamera";
import RippleButton from "./RippleButton";
import useModal from "../utils/useModal";
import DotLoading from "./DotLoading";

const Wrapper = styled(Paper)({
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& img, & video": { width: "100%" },
});

const Overlay = styled("span")({
  fontSize: "18px",
});

const SnapshotButton = styled(RippleButton)({
  border: "none",
  padding: 0,
  background: "transparent",
});

export default function Camera({
  aspectRatio,
  entityId,
  onMove,
}: {
  aspectRatio: number;
  entityId: string;
  onMove?: (direction: "LEFT" | "RIGHT" | "UP" | "DOWN") => void;
}) {
  const entity = useEntity(entityId);
  const [mount, modals] = useModal();
  const entityPicture = entity?.attributes?.entity_picture;
  const [snapshot, setSnapshot] = useState<string | undefined>("LOADING");
  const isStreaming = modals.length < 0;

  useEffect(() => {
    if (isStreaming) {
      return;
    }

    if (!entityPicture) {
      setSnapshot(undefined);
      return;
    }

    let timeout = 0;

    async function updateImage() {
      const url = `${hassUrl}${entityPicture}&counter=${Date.now()}`;

      const success = await new Promise<boolean>((resolve) => {
        const image = new Image();

        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);

        image.src = url;
      });

      setSnapshot(success ? url : undefined);

      timeout = window.setTimeout(updateImage, 10_000);
    }

    updateImage();

    return () => {
      window.clearTimeout(timeout);
    };
  }, [entityPicture, isStreaming]);

  function showStream() {
    mount((unmount) => (
      <FullScreenCamera
        aspectRatio={aspectRatio}
        entityId={entityId}
        onMove={onMove}
        onClose={unmount}
      />
    ));
  }

  return (
    <Wrapper style={{ aspectRatio: aspectRatio.toString() }}>
      {modals}
      {snapshot === "LOADING" ? (
        <CircularProgress />
      ) : snapshot ? (
        <SnapshotButton onClick={showStream}>
          <img alt="" src={snapshot} />
        </SnapshotButton>
      ) : (
        <Overlay>Câmera Indisponível</Overlay>
      )}
    </Wrapper>
  );
}