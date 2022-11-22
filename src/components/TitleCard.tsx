import { cx } from "../utils/styling";
import Paper from "./Paper";
import classes from "./TitleCard.module.scss";

export default function TitleCard({
  className,
  title,
  action,
}: {
  className?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <Paper className={cx(className, classes.root)}>
      <h2 className={classes.title}>{title}</h2>
      {action}
    </Paper>
  );
}
