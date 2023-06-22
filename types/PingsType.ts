import { Pings, User } from "@prisma/client";

export type FullPingType = Pings & {
  sender: User;
};
