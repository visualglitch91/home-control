import { Fragment } from "react";
import Paper from "./Paper";
import EntityButton from "./EntityButton";
import EntitiesSwitch from "./EntitiesSwitch";
import { Row } from "./ListCard";
import { useResponsive } from "../utils/general";
import classes from "./EntityGrid.module.scss";

export default function EntityGrid({
  title,
  rows,
  showGroupSwitch,
}: {
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
        return <EntityButton {...row} />;
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
    <div>
      {Boolean(title) && (
        <Paper className={classes.header}>
          <h2 className={classes.heading}>{title}</h2>
          {showGroupSwitch && Boolean(groupedEntityIds.length) && (
            <EntitiesSwitch entityIds={groupedEntityIds} />
          )}
        </Paper>
      )}
      <div className={classes.content}>
        {rows.map((row, index) => (
          <Fragment key={index}>{renderRow(row)}</Fragment>
        ))}
      </div>
    </div>
  );
}
