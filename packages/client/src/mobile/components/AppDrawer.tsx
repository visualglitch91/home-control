import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button, List, ListItem, SwipeableDrawer, styled } from "@mui/material";
import Icon from "../../components/Icon";
import useMountEffect from "../../utils/useMountEffect";
import ClockAndWeather from "../../components/ClockAndWeather";
import useSwipe from "../../utils/useSwipe";

const DrawerButton = styled(Button)({
  justifyContent: "flex-start",
  textTransform: "none",
  padding: "8px 22px",
  fontSize: "16px",
});

function AppLink({
  active,
  icon,
  label,
  path,
}: {
  active: boolean;
  icon: string;
  label: string;
  path: string;
}) {
  return (
    <ListItem>
      <Link to={path}>
        <DrawerButton
          size="large"
          color="white"
          variant={active ? "contained" : "text"}
          fullWidth
          startIcon={<Icon icon={icon} />}
        >
          {label}
        </DrawerButton>
      </Link>
    </ListItem>
  );
}

export function AppDrawer({
  pages,
}: {
  pages: Omit<React.ComponentProps<typeof AppLink>, "active">[];
}) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    window.setTimeout(setOpen, 200, false);
  }, [location]);

  useMountEffect(() => {
    const toggle = () => setOpen((x) => !x);

    window.addEventListener("toggle-app-drawer", toggle);

    return () => {
      window.removeEventListener("toggle-app-drawer", toggle);
    };
  });

  useSwipe(document.body, (direction) => {
    if (direction === "right") {
      setOpen(true);
    }
  });

  return (
    <SwipeableDrawer
      disableDiscovery
      disableSwipeToOpen
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <ClockAndWeather
        compact
        sx={(theme) => ({
          margin: "32px 26px 10px",
          background: theme.palette.white.main,
          color: theme.palette.white.contrastText,
        })}
      />
      <List sx={{ px: 1.2 }}>
        {pages.map((it, index) => (
          <AppLink key={index} {...it} active={location.startsWith(it.path)} />
        ))}
      </List>
    </SwipeableDrawer>
  );
}