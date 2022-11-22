import { Fragment } from "react";
import { css, styled } from "../utils/styling";
import Paper from "./Paper";
import EntityButton from "./EntityButton";
import EntitiesSwitch from "./EntitiesSwitch";
import { Row } from "./ListCard";
import { useResponsive } from "../utils/general";

const Header = styled(
  Paper,
  css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    padding: 8px 16px;
    column-gap: 8px;
    margin-bottom: 16px;
  `
);

const Heading = styled(
  "h2",
  css`
    margin: 0;
    font-size: 18px;
    line-height: 32px;
  `
);

const Content = styled(
  "div",
  css`
    display: grid;
    justify-content: center;
    grid-gap: 8px;
    grid-template-columns: repeat(auto-fill, minmax(min(80px, 100%), 1fr));
  `
);

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
        <Header>
          <Heading>{title}</Heading>
          {showGroupSwitch && Boolean(groupedEntityIds.length) && (
            <EntitiesSwitch entityIds={groupedEntityIds} />
          )}
        </Header>
      )}
      <Content>
        {rows.map((row, index) => (
          <Fragment key={index}>{renderRow(row)}</Fragment>
        ))}
      </Content>
    </div>
  );
}
