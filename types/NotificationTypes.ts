import { Notification, User } from "@prisma/client";

type NotificationSender = {
  sender: User;
};

export type FullNotifications = Notification & NotificationSender;
