import { useState } from "react";
import useMountEffect from "$client/utils/useMountEffect";
import clock from "$client/utils/clock";
import { SxProps } from "$client/theme/utils";
import { sxx } from "$client/utils/styling";
import GlossyPaper from "./GlossyPaper";

function getTime() {
  const now = new Date();
  const hours = ("0" + now.getHours()).slice(-2);
  const minutes = ("0" + now.getMinutes()).slice(-2);

  return `${hours}:${minutes}`;
}

export default function Clock({ sx }: { sx: SxProps }) {
  const [time, setTime] = useState(getTime);

  useMountEffect(() => {
    return clock.on(() => setTime(getTime()));
  });

  return (
    <GlossyPaper
      sx={sxx(
        {
          textAlign: "center",
          fontSize: "86px",
          padding: "12px 0 24px",
        },
        sx
      )}
    >
      {time}
    </GlossyPaper>
  );
}
