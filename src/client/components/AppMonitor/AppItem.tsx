import { useMutation } from "react-query";
import { useConfirm } from "../../utils/useConfirm";
import { queryClient } from "../../utils/queryClient";
import ListItem from "../ListItem";
import { ParsedApp, STATUS_COLORS, formatName } from "./utils";
import { useMenu } from "../../utils/useMenu";
import DotLoading from "../DotLoading";
import ColorBadge from "../ColorBadge";
import api from "../../utils/api";

type Action = "stop" | "start" | "restart";

export function AppItem({ app }: { app: ParsedApp }) {
  const [showMenu, menu] = useMenu();
  const [confirm, modals] = useConfirm();

  const runAction = useMutation(({ action }: { action: Action }) => {
    return api(
      `/app-manager/${app.type}/${app.rawName}/${action}`,
      "post"
    ).then(() => queryClient.refetchQueries("apps"));
  });

  const running = app.status === "running";

  function showActionsMenu() {
    showMenu({
      title: "Opções",
      options: running
        ? [
            { value: "stop", label: "Parar" },
            { value: "restart", label: "Reiniciar" },
          ]
        : [{ value: "start", label: "Iniciar" }],
      onSelect: running
        ? (action) => {
            confirm({
              title: "Continuar?",
              onConfirm: () => runAction.mutate({ action }),
            });
          }
        : (action) => runAction.mutate({ action }),
    });
  }

  return (
    <ListItem
      icon={<ColorBadge size={12} color={STATUS_COLORS[app.status]} />}
      label={formatName(app.name)}
      onSecondaryAction={showActionsMenu}
    >
      {menu}
      {modals}
      {runAction.isLoading ? <DotLoading /> : running ? app.usage : "Parado"}
    </ListItem>
  );
}
