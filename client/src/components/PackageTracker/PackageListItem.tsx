import { Box, Stack, Typography, styled } from "@mui/material";
import { PackageTrackerItem } from "$common/types/package-tracker";
import { formatDate } from "$client/utils/general";
import GlossyPaper from "../GlossyPaper";
import AltIconButton from "../AltIconButton";
import ListItem from "../ListItem";
import ColorBadge from "../ColorBadge";

const STATUS_COLORS = {
  delivered: "#50fa7b",
  "in-transit": "#8be9fd",
  "en-route": "#f1fa8c",
  "pending-payment": "#f1fa8c",
  "not-found": "#ff5555",
} as const;

const Desciption = styled("span")({
  opacity: 0.8,
  fontSize: "14px",
  fontWeight: 500,
  "& > span": {
    whiteSpace: "pre-wrap",
    display: "block",
  },
});

export default function PackageListItem({
  item,
  onRemove,
}: {
  item: PackageTrackerItem;
  onRemove: () => void;
}) {
  return (
    <GlossyPaper sx={{ opacity: item.status === "delivered" ? 0.5 : 1 }}>
      <ListItem
        sx={{
          "& .MuiListItemSecondaryAction-root": {
            py: "6px",
            alignItems: "flex-end",
            flexDirection: "column",
            justifyContent: item.lastEvent ? "space-between" : "center",
          },
        }}
        primaryText={
          <Stack direction="row" alignItems="center" spacing={0.8}>
            <ColorBadge
              size={12}
              sx={{ flexShrink: 0 }}
              color={STATUS_COLORS[item.status]}
            />
            <Box sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.name}
            </Box>
          </Stack>
        }
        secondaryText={
          <>
            <Box sx={{ fontWeight: 600 }}>{item.code}</Box>
            {item.lastEvent ? (
              <Desciption>
                <span>
                  {item.lastEvent.description
                    .replace(/Local: /g, "")
                    .replace(/LOCAL: /g, "")}
                </span>
                {item.lastEvent.location && item.status !== "delivered" && (
                  <span>{item.lastEvent.location}</span>
                )}
              </Desciption>
            ) : (
              <Desciption>Não Encontrado</Desciption>
            )}
          </>
        }
        endSlot={
          <>
            {item.lastEvent?.at && (
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {formatDate(item.lastEvent.at)}
              </Typography>
            )}
            <span>
              <AltIconButton icon="close" onClick={onRemove} />
            </span>
          </>
        }
      />
    </GlossyPaper>
  );
}
