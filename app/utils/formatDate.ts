import { format, isYesterday, isToday, parseISO } from "date-fns";

import { FullPingType } from "@/types/PingsType";

type PingAccumulator = {
  [index: string]: FullPingType[];
};
type PingItemAccumulator = (FullPingType | { type: string; date: string })[];

export const formatDate = (
  date: Date | string,
  flag?: "pings" | "optional"
): string => {
  if (!date) return "";

  const parsedDate = typeof date === "string" ? parseISO(date) : date;
  const isTodayDate = isToday(parsedDate);
  const yesterday = isYesterday(parsedDate);

  if (flag === "optional") {
    if (isTodayDate) {
      return format(parsedDate, "p");
    } else if (yesterday) {
      return "Yesterday";
    } else {
      return format(parsedDate, "dd/MM/yyyy");
    }
  } else {
    if (isTodayDate && flag) {
      return "Today";
    } else if (isTodayDate) {
      return format(parsedDate, "p");
    } else if (yesterday) {
      return "Yesterday";
    } else {
      return format(parsedDate, "dd/MM/yyyy");
    }
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
