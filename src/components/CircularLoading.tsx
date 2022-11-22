import classes from "./CircularLoading.module.scss";

export default function CircularLoading() {
  return (
    <div className={classes.root}>
      <svg viewBox="25 25 50 50">
        <circle cx="50" cy="50" r="20" />
      </svg>
    </div>
  );
}
