import { useMutation, useQuery } from "@tanstack/react-query";
//@ts-expect-error
import humanizeDuration from "humanize-duration";
import { useMenu } from "../utils/useMenu";
import { usePrompt } from "../utils/usePrompt";
import api from "../utils/api";
import { queryClient } from "../utils/queryClient";
import EntityListItem from "../components/EntityListItem";
import DownloadListCard, { DownloadItem } from "../components/DownloadListCard";
import { JDownloaderItem } from "../../types/jdownloader";
import { useEntity } from "../utils/hass";

function parseETA(value: number) {
  return humanizeDuration(value * 1000, {
    round: true,
    language: "pt",
  });
}

function parseItem(item: JDownloaderItem): DownloadItem {
  return {
    id: String(item.uuid),
    name: item.name,
    eta:
      item.finished || item.speed <= 0
        ? null
        : parseETA((item.bytesTotal - item.bytesLoaded) / item.speed),
    status: item.finished ? "downloading" : "completed",
    active: !item.finished,
    completed: item.finished,
    percentDone: (item.bytesLoaded / item.bytesTotal) * 100,
  };
}

function JDownloader() {
  const enabled = useEntity("switch.casa_jdownloader")?.state === "on";

  const { data = [] } = useQuery(
    ["jdownloader"],
    () => {
      return api<JDownloaderItem[]>("/jdownloader/downloads", "get").then(
        (data) => data.map(parseItem)
      );
    },
    { enabled, refetchInterval: 2_000, cacheTime: 5 * 60_000 }
  );

  const { mutate } = useMutation((func: () => Promise<any>) =>
    func().then(() => queryClient.refetchQueries(["torrents"]))
  );

  const [showMenu, menu] = useMenu();
  const [prompt, modals] = usePrompt();

  function onAdd() {
    prompt({
      title: "Adicionar",
      fields: ["Download URL"],
      onConfirm: ([url]) => {
        mutate(() => api("/jdownloader/add", "post", { url }));
      },
    });
  }

  function onItemClick(item: DownloadItem) {
    showMenu({
      title: "Opções",
      options: [{ value: "remove", label: "Remover download" }],
      onSelect: (value) => {
        if (value !== "remove") {
          return;
        }

        mutate(() =>
          api(`/jdownloader/remove`, "post", {
            id: item.id,
          })
        );
      },
    });
  }

  return (
    <>
      {menu}
      {modals}
      <DownloadListCard
        title="JDownloader"
        downloads={enabled ? data : []}
        onAdd={onAdd}
        onItemClick={onItemClick}
      >
        <EntityListItem
          sx={{ py: "16px" }}
          changeTimeout={15_000}
          entityId="switch.casa_jdownloader"
        />
      </DownloadListCard>
    </>
  );
}

const jDownloaderModule = <JDownloader />;

export default jDownloaderModule;
