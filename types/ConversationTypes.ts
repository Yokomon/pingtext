import { Conversation, User } from "@prisma/client";

export type FullConversationType = Conversation & {
  users: User[];
};
