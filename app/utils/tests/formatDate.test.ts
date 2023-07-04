import { FullPingType } from "@/types/PingsType";
import { formatDate, formatPingChats } from "../formatDate";
import { mock_pingDate, mock_pingDate2, mock_pingDate3 } from "./__mocks__";

const getDate = (date: Date, flag: "yesterday" | "daysAfter") => {
  switch (flag) {
    case "yesterday":
      date.setDate(date.getDate() - 1);
      return date;
      break;
    case "daysAfter":
      date.setDate(date.getDate() - 4);
      return date;
      break;
    default:
      return new Date();
      break;
  }
};

const mockDate1 = getDate(new Date(), "yesterday");

describe("Format date spec", () => {
  test("Date should render yesterday accurately", () => {
    const formattedDate = formatDate(mockDate1);
    expect(formattedDate).toMatch(/yesterday/i);
  });
});

describe("Format ping date specs", () => {
  it.skip("should return null for an empty array of pings", () => {
    // If no messages by default
    const pings: FullPingType[] = [];
    const result = formatPingChats(pings);
    expect(result).toBeNull();
  });

  it.skip('should return "Today" if all pings are from today', () => {
    const result = formatPingChats(mock_pingDate);
    expect(result).toBe("Today");
  });

  it.skip('should return "Yesterday" if all pings are from yesterday', () => {
    const result = formatPingChats(mock_pingDate2);
    expect(result).toBe("Yesterday");
  });

  it.skip("should return the formatted date if pings are from different dates", () => {
    const result = formatPingChats(mock_pingDate3);
    expect(result).toBe("20/06/2023");
  });
});
