export function getWeekDates() {
  const today = new Date();

  console.log("today", today);

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

export function getPhilippineToday() {
  const now = new Date();
  // Get UTC time and add 8 hours for Philippine time
  const phTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
  
  const year = phTime.getUTCFullYear();
  const month = String(phTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(phTime.getUTCDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

export function getPhilippineWeekDates() {
  const now = new Date();
  const phTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
  
  const currentDay = phTime.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate days to Monday (start of week)
  // If Sunday (0), go back 6 days. Otherwise go back (currentDay - 1) days
  const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
  
  const monday = new Date(phTime);
  monday.setUTCDate(phTime.getUTCDate() - daysToMonday);
  monday.setUTCHours(0, 0, 0, 0);
  
  const weekDates = [];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const todayStr = getPhilippineToday();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setUTCDate(monday.getUTCDate() + i);
    
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    weekDates.push({
      day: days[i],
      date: dateStr,
      fullDate: date,
      isToday: dateStr === todayStr
    });
  }
  
  return weekDates;
}
