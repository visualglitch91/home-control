import React, { useMemo, useState } from "react";
import { Dropdown, IconButton, Menu, MenuButton, MenuItem } from "@mui/joy";
import { MultipleResponsiveCardContext } from "./utils";
import { useMenu } from "../../utils/useMenu";
import Icon from "../Icon";
import RippleButton from "../RippleButton";

export default function MultipleResponsiveCard({
  stickyMobileTitle,
  largerMobileTitle,
  views,
}: {
  stickyMobileTitle?: boolean;
  largerMobileTitle?: boolean;
  views: Record<string, [string, React.ReactNode]>;
}) {
  const [active, setActive] = useState(() => Object.keys(views)[0]);
  const [showMenu, menu] = useMenu();
  const view = views[active][1];

  const value = useMemo(() => {
    const onShowMenu = () => {
      showMenu({
        title: "",
        options: Object.entries(views).map(([key, view]) => ({
          value: key,
          label: view[0],
        })),
        onSelect: setActive,
      });
    };

    const viewSwitcher = (
      <Dropdown>
        <MenuButton
          sx={{
            borderRadius: "100%",
            border: "1px solid white",
            color: "white",
            width: "24px",
            height: "24px",
            minHeight: 0,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
          }}
        >
          <Icon icon="chevron-down" />
        </MenuButton>
        <Menu>
          {Object.entries(views).map(([key, view]) => (
            <MenuItem onClick={() => setActive(key)}>{view[0]}</MenuItem>
          ))}
        </Menu>
      </Dropdown>
    );

    return { viewSwitcher, stickyMobileTitle, largerMobileTitle };
    //eslint-disable-next-line
  }, [stickyMobileTitle, largerMobileTitle]);

  if (!view) {
    return null;
  }

  return (
    <>
      {menu}
      <MultipleResponsiveCardContext.Provider value={value}>
        {view}
      </MultipleResponsiveCardContext.Provider>
    </>
  );
}