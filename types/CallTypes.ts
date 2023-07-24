import { Call, User } from "@prisma/client";

export type MixedCallerTypes = Call & {
  caller: User;
  callReceiver?: User;
};

export type NewCall = {
  userId: string;
  name: string;
  callId: string;
};
