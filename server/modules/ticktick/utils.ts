export function normalizeDate(date: string, timeZone?: string) {
  if (!timeZone) {
    const [parsedDate] = date.split(".");
    return new Date(parsedDate);
  }

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const { year, month, day, hour, minute, second } = formatter
    .formatToParts(new Date(date))
    .reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {} as Record<string, string>);

  const adjustedDate = new Date(
    `${year}-${month}-${day} ${hour === "24" ? 0 : hour}:${minute}:${second}`
  );

  return adjustedDate;
}
