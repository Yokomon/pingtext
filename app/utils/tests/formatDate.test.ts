import { FullPingType } from "@/types/PingsType";
import { formatDate, formatPingChat } from "../formatDate";

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
  it("should return null for an empty array of pings", () => {
    // If no messages by default
    const pings: FullPingType[] = [];
    const result = formatPingChat(pings);
    expect(result).toBeNull();
  });

  it('should return "Today" if all pings are from today', () => {
    const mock_pings: FullPingType[] = [
      {
        id: "id12312",
        body: "Testing",
        senderId: "senderId",
        receiverIds: ["receiveId"],
        conversationId: "convoId",
        createdAt: new Date(),
        updatedAt: new Date(),
        sender: {
          id: "6485b46cf41bbd41cc3505eb",
          name: "Test 1",
          email: "test1@test.com",
          emailVerified: null,
          hashedPassword: null,
          image: "image",
          createdAt: new Date(),
          updatedAt: new Date(),
          conversationsIds: ["conversationIds"],
          receivedPingsIds: ["pingsId"],
          friendsIds: ["firnedIds1"],
        },
      },
    ];

    const result = formatPingChat(mock_pings);
    expect(result).toBe("Today");
  });

  it('should return "Yesterday" if all pings are from yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const mock_pings: FullPingType[] = [
      {
        id: "id12312",
        body: "Testing",
        senderId: "senderId",
        receiverIds: ["receiveId"],
        conversationId: "convoId",
        createdAt: yesterday,
        updatedAt: yesterday,
        sender: {
          id: "6485b46cf41bbd41cc3505eb",
          name: "Test 1",
          email: "test1@test.com",
          emailVerified: null,
          hashedPassword: null,
          image: "image",
          createdAt: yesterday,
          updatedAt: yesterday,
          conversationsIds: ["conversationIds"],
          receivedPingsIds: ["pingsId"],
          friendsIds: ["firnedIds1"],
        },
      },
    ];
    const result = formatPingChat(mock_pings);
    expect(result).toBe("Yesterday");
  });

  it("should return the formatted date if pings are from different dates", () => {
    // Mocks will be moved in next release
    const mock_pings: FullPingType[] = [
      {
        id: "id12312",
        body: "Testing",
        senderId: "senderId",
        receiverIds: ["receiveId"],
        conversationId: "convoId",
        createdAt: new Date("2023-06-20"),
        updatedAt: new Date("2023-06-20"),
        sender: {
          id: "6485b46cf41bbd41cc3505eb",
          name: "Test 1",
          email: "test1@test.com",
          emailVerified: null,
          hashedPassword: null,
          image: "image",
          createdAt: new Date("2023-06-21"),
          updatedAt: new Date("2023-06-21"),
          conversationsIds: ["conversationIds"],
          receivedPingsIds: ["pingsId"],
          friendsIds: ["firnedIds1"],
        },
      },
    ];

    const result = formatPingChat(mock_pings);
    expect(result).toBe("20/06/2023");
  });
});
