"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FiEye } from "@react-icons/all-files/fi/FiEye";
import { FiBell } from "@react-icons/all-files/fi/FiBell";
import { useMutation } from "@tanstack/react-query";
import { Friend, Notification, User } from "@prisma/client";

import { FullNotifications } from "@/types/NotificationTypes";
import { Modal } from "@/app/components/Modal";
import { DynamicStateType } from "@/types/DynamicState";
import { NotificationBox } from "./NotificationBox";
import processNotification from "../utils/processNotification";

interface NotificationsListProps {
  unReadNotifications: FullNotifications[];
  readNotifications: FullNotifications[];
  currentUser: User;
}

export type EnableModalType = {
  user: User;
  notification: Notification;
  friend: Friend | null;
  isUserSender: boolean;
};
export const NotificationsList: React.FC<NotificationsListProps> = ({
  unReadNotifications,
  readNotifications,
  currentUser,
}) => {
  const router = useRouter();

  const notificationMutation = useMutation({
    mutationFn: (values: { notificationId: string; isUserSender: boolean }) => {
      return axios.put("/api/notifications", values);
    },
    onSuccess: async () => {
      return router.refresh();
    },
  });

  const addFriendMutation = useMutation({
    mutationFn: (values: {
      userId: string;
      notificationId?: string;
      friendId?: string;
    }) => {
      return axios.put("/api/friends", values);
    },
    onSuccess: async () => {
      toast.success(
        `${dynamicState.user?.name} has been added to friends list`
      );
      setOpenNotifications(!openNotifications);
      router.refresh();
    },
    onError: async () => {
      toast.error(`An error occured with the system. Please try again later`);
    },
  });

  const rejectFriendMutation = useMutation({
    mutationFn: (values: {
      notificationId?: string;
      friendId?: string;
      reject: boolean;
    }) => {
      return axios.put("/api/friends", values);
    },
    onSuccess: async () => {
      toast.success(`Rejected friendship with ${dynamicState.user?.name}`);
      setOpenNotifications(!openNotifications);
      router.refresh();
    },
    onError: async () => {
      toast.error(`An error occured with the system. Please try again later`);
    },
  });

  const [openNotifications, setOpenNotifications] = useState(false);
  const [dynamicState, setDynamicState] = useState<DynamicStateType>({
    user: null,
    notificationId: "",
    message: "",
    friend: null,
    userActions: true,
  });

  const enableModal = useCallback(
    async ({ user, notification, friend, isUserSender }: EnableModalType) => {
      processNotification({
        user,
        notification,
        friend,
        isUserSender,
        openNotifications,
        notificationMutation,
        currentUser,
        setDynamicState,
        setOpenNotifications,
      });
    },
    [openNotifications, notificationMutation, currentUser]
  );

  const addFriendToList = (user: User | null) => {
    if (!user)
      return toast.error("Cannot perform operation. Please try again later.");

    addFriendMutation.mutate({
      userId: user.id,
      notificationId: dynamicState.notificationId,
      friendId: dynamicState.friend?.id,
    });
  };

  const rejectFriendShip = (user: User | null) => {
    if (!user)
      return toast.error("Cannot perform operation. Please try again later.");

    rejectFriendMutation.mutate({
      friendId: dynamicState.friend?.id,
      notificationId: dynamicState.notificationId,
      reject: true,
    });
  };

  const isModalLoading =
    addFriendMutation.isLoading || rejectFriendMutation.isLoading;

  const onClose = useCallback(() => {
    setOpenNotifications(!openNotifications);
  }, [openNotifications]);

  return (
    <div>
      <Modal
        isOpen={openNotifications}
        onClose={onClose}
        primaryText={"Add to friend list"}
        primaryAction={() => addFriendToList(dynamicState.user)}
        title="Friend request"
        content={dynamicState.message}
        secondaryAction={() => rejectFriendShip(dynamicState.user)}
        secondaryText="Reject"
        isLoading={isModalLoading}
        userActions={dynamicState.userActions}
        isDangerous
      />
      <aside className="h-full lg:p-4 lg:pl-20 border-r border-gray-50 dark:border-gray-50/10 shadow-sm lg:w-[27rem] fixed inset-0">
        <section className="px-5 pr-1">
          <h3 className="text-sky-600 text-3xl mb-4 font-semibold tracking-wide">
            Notifications
          </h3>
          <div className="relative">
            <div className="flex text-gray-500 dark:text-gray-200 items-center space-x-2 mb-4">
              <FiBell size={16} />
              <h5 className="text-base">All Notifications</h5>
            </div>
            <NotificationBox
              data={unReadNotifications}
              enableModal={enableModal}
              currentUser={currentUser}
            />
          </div>
          <div className="relative mt-24">
            <div className="flex text-gray-500 dark:text-gray-200 items-center space-x-2 mb-4">
              <FiEye size={16} />
              <h5 className="text-base">Read Notifications</h5>
            </div>
            <NotificationBox
              data={readNotifications}
              enableModal={enableModal}
              currentUser={currentUser}
            />
          </div>
        </section>
      </aside>
    </div>
  );
};
