import humanizeDuration from "humanize-duration";
import { LinearProgress, Tooltip, styled } from "@mui/joy";
import PillButton from "./PillButton";
import Icon from "./Icon";
import FlexRow from "./FlexRow";
import { formatNumericValue, useResponsive } from "../utils/general";
import { alpha } from "../utils/styles";
import RippleButton from "./RippleButton";
import { borderRadius } from "./Paper";
import EmptyState from "./EmptyState";
import ResponsiveCard from "./ResponsiveCard";

const ItemCard = styled(RippleButton)(({ theme }) => ({
  padding: 16,
  width: "100%",
  justifyContent: "stretch",
  textAlign: "left",
  background: "transparent",
  border: "none",
  [theme.breakpoints.down("sm")]: { borderRadius },
  "&:hover": { backgroundColor: alpha(theme.palette.neutral[800], 0.3) },
}));

const ItemContent = styled("div")({
  display: "flex",
  flexDirection: "column",
  rowGap: "8px",
  width: "100%",
  alignItems: "flex-start",
  overflow: "hidden",
});

const Header = styled(FlexRow)({
  width: "100%",
  overflow: "hidden",
});

const Name = styled("span")({
  flex: 1,
  fontSize: "14px",
  fontWeight: 500,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const Details = styled(FlexRow)({
  opacity: 0.8,
  fontSize: "12px",
  fontWeight: 600,
});

const STATUS_LABELS = {
  downloading: "Baixando",
  seeding: "Subindo",
  completed: "Completo",
  stopped: "Parado",
  error: "Erro",
  queued: "Na Fila",
  verifying: "Verificando",
};

export type DownloadStatus =
  | "downloading"
  | "seeding"
  | "completed"
  | "stopped"
  | "error"
  | "queued"
  | "verifying"
  | "error";

export interface DownloadItem {
  id: string;
  name: string;
  eta: number | null;
  status: DownloadStatus;
  active: boolean;
  completed: boolean;
  percentDone: number;
}

export default function DownloadListCard({
  title,
  stickyMobileTitle,
  downloads,
  loading,
  children,
  onAdd,
  onItemClick,
}: {
  title: string;
  downloads: DownloadItem[];
  stickyMobileTitle?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  onAdd: () => void;
  onItemClick: (item: DownloadItem) => void;
}) {
  const { isMobile } = useResponsive();

  return (
    <ResponsiveCard
      spacing={0}
      title={title}
      variant="compact"
      stickyMobileTitle={stickyMobileTitle}
      // titleChildren={<PillButton icon="mdi:plus" onClick={onAdd} />}
      groups={[
        <>{children}</>,
        ...(downloads.length === 0
          ? [
              <EmptyState
                sx={{ pt: "18px" }}
                loading={loading}
                text="Nenhum download adicionado"
              />,
            ]
          : downloads.map((it) => (
              <Tooltip key={it.id} title={it.name}>
                <ItemCard onClick={() => onItemClick(it)}>
                  <ItemContent>
                    <Header>
                      <Icon
                        size={16}
                        icon={
                          it.completed
                            ? "mdi-check"
                            : it.status === "seeding"
                            ? "mdi-arrow-up"
                            : it.active
                            ? "mdi-arrow-down"
                            : "mdi-pause"
                        }
                      />
                      <Name>{it.name}</Name>
                    </Header>
                    <LinearProgress
                      determinate
                      variant="outlined"
                      thickness={isMobile ? 6 : 7}
                      value={it.percentDone}
                      sx={{ width: "100%" }}
                    />
                    <Details>
                      <span>{STATUS_LABELS[it.status]}</span>
                      <span>{formatNumericValue(it.percentDone, "%", 0)}</span>
                      <span>
                        {it.eta &&
                          humanizeDuration(it.eta, {
                            round: true,
                            language: "pt",
                          })}
                      </span>
                    </Details>
                  </ItemContent>
                </ItemCard>
              </Tooltip>
            ))),
      ]}
    />
  );
}
