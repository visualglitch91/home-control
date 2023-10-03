import { Habit } from "@home-control/types/ticktick";
import ListCard from "./ListCard";
import api from "../utils/api";
import { useConfirm } from "../utils/useConfirm";
import TaskList from "./TaskList";

const colors = {
  zeroed: "#ff5555",
  partial: "#f1fa8c",
  done: "#50fa7b",
};

export default function Habits({
  items,
  requestRefresh,
}: {
  items: Habit[];
  requestRefresh: () => void;
}) {
  const [confirm, modals] = useConfirm();

  return (
    <>
      {modals}
      <ListCard title="Hábitos">
        <TaskList
          items={items.map((item) => {
            const stauts =
              item.value >= item.goal
                ? "done"
                : item.value === 0
                ? "zeroed"
                : "partial";

            return {
              title: item.name,
              subtitle: (
                <span
                  style={{ color: colors[stauts] }}
                >{`${item.value}/${item.goal}`}</span>
              ),
              click: () => {
                confirm({
                  title: "Marcar hábito?",
                  onConfirm: () => {
                    api("/ticktick/habits/checkin", "POST", {
                      habitId: item.habitId,
                    }).then(() => {
                      requestRefresh();
                    });
                  },
                });
              },
            };
          })}
        />
      </ListCard>
    </>
  );
}