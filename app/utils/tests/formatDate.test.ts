import { formatDate } from "../formatDate";

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
const mockDate2 = getDate(new Date(), "daysAfter");

describe("Format date spec", () => {
  test("Date should render yesterday accurately", () => {
    const formattedDate = formatDate(mockDate1);
    expect(formattedDate).toMatch(/yesterday/i);
  });
  test("Date should render 4 days after", () => {
    const formattedDate = formatDate(mockDate2);

    expect(formattedDate).toMatch("16/06/2023");
  });
});
