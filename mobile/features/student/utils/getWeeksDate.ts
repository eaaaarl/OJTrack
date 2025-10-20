export function getWeekDates() {
  const today = new Date();
  const currentDay = today.getDay();
  const first = today.getDate() - currentDay; // Monday

  const weekDates = [];
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today.setDate(first + i));
    weekDates.push({
      day: days[i],
      date: date.toISOString().split("T")[0],
      date_obj: date,
    });
  }

  return weekDates;
}
