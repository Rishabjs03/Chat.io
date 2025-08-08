export function formatMessageTime(date) {
  if (!date) return ""; // Prevent crash if no date
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return ""; // Prevent "Invalid Date"

  return parsedDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
