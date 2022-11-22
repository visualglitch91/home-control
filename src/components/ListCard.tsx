import { Fragment } from "react";
import { HassEntity } from "home-assistant-js-websocket";
import Paper from "./Paper";
import EntityRow from "./EntityRow";
import EntitiesSwitch from "./EntitiesSwitch";
import { useResponsive } from "../utils/general";
import classes from "./ListCard.module.scss";

export type Row =
  | {
      type?: "entity" | undefined;
      hiddenOnDesktop?: boolean;
      entityId: string;
      icon?: string;
      label?: string;
      ignoreOnGroupSwitch?: boolean;
      changeTimeout?: number;
      renderContent?: (entity: HassEntity) => React.ReactNode;
    }
  | {
      type: "divider";
      hiddenOnDesktop?: boolean;
    }
  | {
      type: "custom";
      hiddenOnDesktop?: boolean;
      render: () => React.ReactNode;
    };

export default function ListCard({
  className,
  title,
  rows,
  showGroupSwitch,
}: {
  className?: string;
  title?: string;
  rows: Row[];
  showGroupSwitch?: boolean;
}) {
  const { isDesktop } = useResponsive();

  function renderRow(row: Row) {
    if (row.hiddenOnDesktop && isDesktop) {
      return null;
    }

    switch (row.type) {
      case undefined:
      case "entity":
        return <EntityRow {...row} />;
      case "divider":
        return <div className={classes.divider} />;
      case "custom":
        return row.render();
      default:
        return null;
    }
  }

  const groupedEntityIds = rows
    .filter((it) => {
      return (
        "entityId" in it &&
        !it.ignoreOnGroupSwitch &&
        ["light", "switch", "input_boolean"].includes(
          it.entityId?.split(".")[0]
        )
      );
    })
    .map((it) => "entityId" in it && it.entityId) as string[];

  return (
    <Paper className={className}>
      {Boolean(title) && (
        <div className={classes.header}>
          <h2 className={classes.heading}>{title}</h2>
          {showGroupSwitch && Boolean(groupedEntityIds.length) && (
            <EntitiesSwitch entityIds={groupedEntityIds} />
          )}
        </div>
      )}
      <div className={classes.content}>
        {rows.map((row, index) => (
          <Fragment key={index}>{renderRow(row)}</Fragment>
        ))}
      </div>
    </Paper>
  );
}
