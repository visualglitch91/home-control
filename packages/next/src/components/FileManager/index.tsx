import api from "../../utils/api";
import { useConfirm } from "material-ui-confirm";
import { useMenu } from "../../utils/useMenu";
import useModal from "../../utils/useModal";
import { usePrompt } from "../../utils/usePrompt";
import FileListCard from "./FileListCard";
import SwitchInstallDialog from "./SwitchInstallDialog";
import { Item, useFileNavigation } from "./utils";

export default function FileManager() {
  const [showMenu, menu] = useMenu();
  const [prompt, modals1] = usePrompt();
  const confirm = useConfirm();
  const [mount, modals3] = useModal();

  const { current, prev, items, refetch, changeDir } = useFileNavigation();

  function onOptions(item: Item) {
    showMenu({
      title: "Opções",
      options: [
        {
          value: "rename",
          label: "Renomear",
        },
        {
          value: "download",
          label: "Download",
          hidden: item.type === "dir",
        },
        {
          value: "install-switch",
          label: "Instalar no Switch",
          hidden: ![".xci", ".nsp"].some((it) => item.name.endsWith(it)),
        },
        {
          value: "delete",
          label: "Deletar",
        },
      ],
      onSelect: (action) => {
        switch (action) {
          case "install-switch":
            if (item.type === "file") {
              mount((unmount) => (
                <SwitchInstallDialog file={item} onClose={unmount} />
              ));
            }

            return;
          case "rename":
            prompt({
              title: "Renomear",
              fields: ["Nome"],
              onConfirm: ([name]) => {
                api(`/file-manager/navigation/files/${item.id}`, "patch", {
                  name,
                }).then(refetch);
              },
            });
            return;
          case "delete":
            confirm({
              title: "Deseja contiuar?",
              onConfirm: () => {
                api(`/file-manager/navigation/files/${item.id}`, "delete").then(
                  refetch
                );
              },
            });
            return;
        }
      },
    });
  }

  if (!current) {
    return null;
  }

  return (
    <>
      {menu}
      {modals1}
      {modals3}
      <FileListCard
        items={items}
        current={current}
        prev={prev}
        onChangeDir={changeDir}
        onOptions={onOptions}
      />
    </>
  );
}
