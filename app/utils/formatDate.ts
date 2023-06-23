import { format, isYesterday, isToday } from "date-fns";

import { FullPingType } from "@/types/PingsType";

type PingAccumulator = {
  [index: string]: FullPingType[];
};
type PingItemAccumulator = (FullPingType | { type: string; date: string })[];

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

const groupedDays = (pings: FullPingType[]) => {
  return pings.reduce((acc: PingAccumulator, el) => {
    const pingDay = isToday(el.createdAt)
      ? "Today"
      : isYesterday(el.createdAt)
      ? "Yesterday"
      : format(el.createdAt, "dd/MM/yyyy");

    return {
      ...acc,
      [pingDay]: [...(acc[pingDay] || []), el],
    };
  }, {});
};

export const formatPingChats = (messages: FullPingType[]) => {
  const days = groupedDays(messages);
  const pingDays = Object.keys(days);

  const pingItems = pingDays.reduce((acc: PingItemAccumulator, date) => {
    const pings = days[date];
    return [...acc, { type: "timeline", date }, ...pings];
  }, []);

  return pingItems;
};
