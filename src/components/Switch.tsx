import classes from "./Switch.module.scss";

export default function Switch({
  checked,
  disabled,
  onInput,
}: {
  checked: boolean;
  disabled?: boolean;
  onInput: (e: React.FormEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className={classes.root}>
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={(e) => {
          /*
           * Preact has some bug that changes
           * the checkbox state despite the
           * checked prop
           */
          e.currentTarget.checked = checked;
          onInput(e);
        }}
      />
      <i />
    </label>
  );
}
