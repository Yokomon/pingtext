import { FullPingType } from "@/types/PingsType";

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export const mock_pingDate: FullPingType[] = [
  {
    id: "id12312",
    body: "Testing",
    senderId: "senderId",
    audioUrl: null,
    receiverIds: ["receiveId"],
    conversationId: "convoId",
    createdAt: new Date(),
    updatedAt: new Date(),
    sender: {
      id: "testst123131",
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

export const mock_pingDate2: FullPingType[] = [
  {
    id: "id12312",
    body: "Testing",
    senderId: "senderId",
    audioUrl: null,
    receiverIds: ["receiveId"],
    conversationId: "convoId",
    createdAt: yesterday,
    updatedAt: yesterday,
    sender: {
      id: "testst123131",
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

export const mock_pingDate3: FullPingType[] = [
  {
    id: "id12312",
    body: "Testing",
    senderId: "senderId",
    receiverIds: ["receiveId"],
    conversationId: "convoId",
    createdAt: new Date("2023-06-20"),
    updatedAt: new Date("2023-06-20"),
    audioUrl: null,
    sender: {
      id: "testst123131",
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
