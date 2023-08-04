import { AxiosResponse } from "axios";
import { SetStateAction } from "react";
import { Friend, Notification, User } from "@prisma/client";
import { UseMutationResult } from "@tanstack/react-query";

import { DynamicStateType } from "@/types/DynamicState";

type ProcessNotificationProps = {
  friend: Friend | null;
  user: User;
  notification: Notification;
  currentUser: User | null;
  notificationMutation: UseMutationResult<
    AxiosResponse<any, any>,
    unknown,
    {
      notificationId: string;
      isUserSender: boolean;
    },
    unknown
  >;
  openNotifications: boolean;
  setOpenNotifications: (_value: SetStateAction<boolean>) => void;
  setDynamicState: (_value: SetStateAction<DynamicStateType>) => void;
  isUserSender: boolean;
};

const processNotification = ({
  currentUser,
  notificationMutation,
  openNotifications,
  setDynamicState,
  setOpenNotifications,
  isUserSender,
  friend,
  notification,
  user,
}: ProcessNotificationProps) => {
  const isNotificationRead =
    notification.friendRequestAccepted &&
    currentUser !== null &&
    ((currentUser.id === notification.senderId && notification.readBySender) ||
      (currentUser.id === notification.recipientId &&
        notification.readByRecipient));

  if (isNotificationRead) return;

  if (!notification.readByRecipient || isUserSender) {
    notificationMutation.mutate({
      notificationId: notification.id,
      isUserSender,
    });
  }

  setOpenNotifications(!openNotifications);
  setDynamicState((state) => ({
    ...state,
    friend: friend,
    message: notification.message,
    user,
    notificationId: notification.id,
    userActions: isUserSender ? false : true,
  }));
};

export default processNotification;
