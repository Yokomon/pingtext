import { Pings, User } from "@prisma/client";

export const mock_pings: Pings[] = [
  {
    id: "899012312821902318321aaa122e",
    body: "bodyTest :)",
    audioUrl: null,
    senderId: "test123",
    receiverIds: ["test123", "test12345"],
    conversationId: "87243840231823123218sasa1231",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "899012312821902318321aaa122f",
    body: "bodyTest :)",
    audioUrl: null,
    senderId: "test123",
    receiverIds: ["test123", "test12345"],
    conversationId: "87243840231823123218sasa1231",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "899012312821902318321aaa122g",
    body: "bodyTest :)",
    audioUrl: null,
    senderId: "test123",
    receiverIds: ["test123"],
    conversationId: "87243840231823123218sasa1231",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mock_currentUser: User = {
  name: "unknown",
  id: "test12345",
  email: "unknown@mail.co.uk",
  emailVerified: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  image: null,
  hashedPassword: "asdadsad18239131test",
  conversationsIds: [],
  receivedPingsIds: [],
  friendsIds: [],
};

export const mock_newPings2 = [
  {
    id: "899012312821902318321aaa122g",
    body: "count for 2 :)",
    audioUrl: null,
    senderId: "test123",
    receiverIds: ["test123"],
    conversationId: "87243840231823123218sasa1231",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "899012312821902318321aaa122g",
    body: "count for 3 :)",
    audioUrl: null,
    senderId: "test123",
    receiverIds: ["test123"],
    conversationId: "87243840231823123218sasa1231",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
