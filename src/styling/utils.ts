export function uniqueClassName() {
  return (
    Date.now().toString(36) +
    Math.floor(
      Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
    ).toString(36)
  );
}

export function cx(...classNames: (string | null | undefined | false)[]) {
  return classNames.filter(Boolean).join(" ");
}
