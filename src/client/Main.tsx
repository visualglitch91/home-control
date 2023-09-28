import { useEffect } from "react";
import { GlobalStyles, CssBaseline, CssVarsProvider } from "@mui/joy";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/queryClient";
import { HassProvider } from "./utils/hass";
import { SocketIOProvider } from "./utils/api";
import {
  autoUpdater,
  isTouchDevice,
  ResponsiveProvider,
} from "./utils/general";
import theme from "./theme";
import App from "./components/App";
import "./styles.css";

const globalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      body: {
        backgroundSize: "cover",
        fontFamily: "Raleway",
        color: "white",
        [theme.breakpoints.down("md")]: {
          backgroundImage: `url(${theme.wallpaper.mobile})`,
        },
        [theme.breakpoints.up("md")]: {
          backgroundImage: `url(${theme.wallpaper.desktop})`,
        },
      },
    })}
  />
);

export default function Main() {
  useEffect(() => {
    autoUpdater();

    window.location.hash = "";
    document.addEventListener("resume", autoUpdater);
    window.addEventListener("focus", autoUpdater);

    if (isTouchDevice) {
      window.oncontextmenu = () => false;
      document.body.classList.add("touch-device");
    }

    return () => {
      document.removeEventListener("resume", autoUpdater);
      window.removeEventListener("focus", autoUpdater);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider theme={theme} defaultMode="dark">
        <CssBaseline />
        {globalStyles}
        <ResponsiveProvider>
          <HassProvider>
            <SocketIOProvider>
              <App />
            </SocketIOProvider>
          </HassProvider>
        </ResponsiveProvider>
      </CssVarsProvider>
    </QueryClientProvider>
  );
}
