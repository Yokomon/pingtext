"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { FiEye } from "@react-icons/all-files/fi/FiEye";
import { FiBell } from "@react-icons/all-files/fi/FiBell";

import { FullNotifications } from "@/types/NotificationTypes";
import { Modal } from "@/app/components/Modal";
import { DynamicStateType } from "@/types/DynamicState";
import { Notification, User } from "@prisma/client";
import { NotificationBox } from "./NotificationBox";

interface NotificationsListProps {
  unReadNotifications: FullNotifications[];
  readNotifications: FullNotifications[];
}

export type EnableModalType = {
  user: User;
  notification: Notification;
};
export const NotificationsList: React.FC<NotificationsListProps> = ({
  unReadNotifications,
  readNotifications,
}) => {
  const router = useRouter();

  const [openNotifications, setOpenNotifications] = useState(false);
  const [dynamicState, setDynamicState] = useState<DynamicStateType>({
    user: null,
    recipientId: "",
    notificationId: "",
    message: "",
  });

  const onClose = useCallback(() => {
    setOpenNotifications(!openNotifications);
  }, [openNotifications]);

  const enableModal = useCallback(
    async ({ user, notification }: EnableModalType) => {
      const friendAccepted = notification.message.includes("accepted");

      if (friendAccepted) return;

      if (!notification.read) {
        axios
          .put("/api/notifications", {
            notificationId: notification.id,
          })
          .then(() => router.refresh());
      }

      setOpenNotifications(!openNotifications);
      setDynamicState((state) => ({
        ...state,
        message: notification.message,
        user,
        recipientId: notification.recipientId,
        notificationId: notification.id,
      }));
    },
    [openNotifications, router]
  );

  const addFriendToList = (friend: User) => {
    axios
      .put("/api/friends", {
        friendId: friend.id,
        recipientId: dynamicState.recipientId,
        notificationId: dynamicState.notificationId,
      })
      .then(() => {
        setOpenNotifications(!openNotifications);
        toast.success(`${friend.name} has been added to friends list`);
        router.refresh();
      })
      .catch((err) => {
        console.log({ err });
        toast.error(`An error occured with the system. Please try again later`);
      });
  };

  return (
    <>
      <Modal
        isOpen={openNotifications}
        onClose={onClose}
        primaryText={"Add to friend list"}
        primaryAction={() => addFriendToList(dynamicState.user!)}
        title="Friend request"
        content={dynamicState.message}
      />
      <aside className="z-10 h-full lg:p-4 lg:pl-20 border-r border-gray-50 shadow-sm w-[27rem] fixed inset-0">
        <section className="px-5 pr-1">
          <h3 className="text-sky-600 text-3xl mb-4 font-semibold tracking-wide">
            Notifications
          </h3>
          <div className="relative">
            <div className="flex text-gray-500 items-center space-x-2 mb-4">
              <FiBell size={16} />
              <h5 className="text-base">All Notifications</h5>
            </div>
            <NotificationBox
              data={unReadNotifications}
              enableModal={enableModal}
              unRead
            />
          </div>
          <div className="relative mt-24">
            <div className="flex text-gray-500 items-center space-x-2 mb-4">
              <FiEye size={16} />
              <h5 className="text-base">Read Notifications</h5>
            </div>
            <NotificationBox
              data={readNotifications}
              enableModal={enableModal}
            />
          </div>
        </section>
      </aside>
    </>
  );
};
