import { Friend, Notification, User } from "@prisma/client";

type NotificationSender = {
  sender: User;
  friend: Friend | null;
  recipient?: User;
};

export type FullNotifications = Notification & NotificationSender;
