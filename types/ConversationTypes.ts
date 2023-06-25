import { Conversation, Pings, User } from "@prisma/client";

export type FullConversationType = Conversation & {
  users: User[];
  pings?: Pings[];
};
