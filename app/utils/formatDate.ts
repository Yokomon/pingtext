import { FullPingType } from "@/types/PingsType";
import { format, isYesterday, isToday } from "date-fns";

export const formatDate = (date: Date, flag?: "pings") => {
  if (!date) return;
  // Check if date is today
  const isTodayDate = isToday(date);

  // Check if input date was yesterday
  const yesterday = isYesterday(date);

  if (isTodayDate && flag) {
    return "Today";
  } else if (isTodayDate) {
    const formattedDate = format(date, "p");
    return formattedDate;
  } else if (yesterday) {
    return "Yesterday";
  } else {
    return format(date, "dd/MM/yyyy");
  }
};

export const formatPingChat = (pings: FullPingType[]) => {
  if (!pings.length) return null;

  const result = pings.reduce((acc, ping) => {
    if (isToday(ping.createdAt)) {
      if (acc !== "Today") {
        acc = "Today";
      }
    } else if (isYesterday(ping.createdAt)) {
      if (acc !== "Yesterday") {
        acc = "Yesterday";
      }
    } else {
      acc = format(ping.createdAt, "dd/MM/yyyy");
    }
    return acc;
  }, "");

  return result;
};
