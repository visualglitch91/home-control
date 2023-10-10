import { Box, Grid, Stack, useMediaQuery } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { TickTickData } from "@home-control/types/ticktick";
import api from "../../utils/api";
import Tasks from "../../components/Tasks";
import Bookmarks from "../../components/Bookmarks";
import Habits from "../../components/Habits";
import Forecast from "../../components/Forecast";
import MediaCard from "../../components/MediaCard";
import PackageTracker, {
  usePackageTrackerMenu,
} from "../../components/PackageTracker";
import Section from "../../components/Section";
import Icon from "../../components/Icon";
import AltIconButton from "../../components/AltIconButton";

const bookmarks = <Bookmarks />;
const mediaCard = <MediaCard />;

export default function DashboardPage() {
  const showPackageTrackerMenu = usePackageTrackerMenu();

  const sm = useMediaQuery("@media(max-width: 1000px)");
  const md = useMediaQuery("@media(max-width: 1500px)");
  const lg = useMediaQuery("@media(max-width: 2100px)");

  const { data, refetch } = useQuery(["ticktick"], () =>
    api<TickTickData>("/ticktick/data", "GET")
  );

  const habits = <Habits items={data?.habits || []} requestRefresh={refetch} />;

  const packageTracker = (
    <Section
      title="Encomendas"
      button={
        <AltIconButton onClick={showPackageTrackerMenu}>
          <Icon icon="dots-vertical" size={20} />
        </AltIconButton>
      }
    >
      <PackageTracker />
    </Section>
  );

  const next = (
    <Tasks
      title="Hoje e Próximas"
      items={data?.scheduled || []}
      requestRefresh={refetch}
    />
  );

  const unscheduled = (
    <Tasks
      title="Sem data"
      items={data?.unscheduled || []}
      requestRefresh={refetch}
    />
  );

  if (sm) {
    return (
      <Stack spacing={5}>
        <Box sx={{ width: "100%" }}>{mediaCard}</Box>
        <Forecast days={5} sx={{ width: "100%" }} />
        {bookmarks}
        {next}
        {habits}
        {unscheduled}
        {packageTracker}
      </Stack>
    );
  }

  if (md) {
    return (
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Stack direction="row" spacing={5}>
            <Box sx={{ width: "600px" }}>{mediaCard}</Box>
            <Forecast days={3} sx={{ width: "100%" }} />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          {bookmarks}
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={5}>
            {next}
            {habits}
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={5}>
            {unscheduled}
            {packageTracker}
          </Stack>
        </Grid>
      </Grid>
    );
  }

  if (lg) {
    return (
      <Stack direction="row" spacing={5}>
        <Stack
          spacing={5}
          sx={{
            minWidth: "33%",
            maxWidth: "33%",
          }}
        >
          {mediaCard}
          {habits}
          {packageTracker}
        </Stack>
        <Stack sx={{ width: "67%" }} spacing={5}>
          <Forecast days={5} />
          {bookmarks}
          <Stack direction="row" spacing={5} sx={{ "& > *": { flex: 1 } }}>
            {next}
            {unscheduled}
          </Stack>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={5}>
      <Stack
        spacing={5}
        sx={{
          minWidth: "25%",
          maxWidth: "25%",
        }}
      >
        {mediaCard}
        {habits}
      </Stack>
      <Stack sx={{ width: "50%" }} spacing={5}>
        <Forecast days={5} />
        {bookmarks}
        <Stack direction="row" spacing={5} sx={{ "& > *": { flex: 1 } }}>
          {next}
          {unscheduled}
        </Stack>
      </Stack>
      {packageTracker}
    </Stack>
  );
}
