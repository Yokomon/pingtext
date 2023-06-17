import { Friend, User } from "@prisma/client";

export interface DynamicStateType {
  user: null | User;
  recipientId?: string;
  notificationId?: string;
  message: string;
  friend: Friend | null;
  userActions?: boolean;
}
