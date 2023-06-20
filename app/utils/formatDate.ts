import { format, isYesterday, isToday } from "date-fns";

export const formatDate = (date: Date) => {
  if (!date) return;
  // Check if date is today
  const isTodayDate = isToday(date);

  // Check if input date was yesterday
  const yesterday = isYesterday(date);

  if (isTodayDate) {
    const formattedDate = format(date, "p");
    return formattedDate;
  } else if (yesterday) {
    return "Yesterday";
  } else {
    return format(date, "dd/MM/yyyy");
  }
};
