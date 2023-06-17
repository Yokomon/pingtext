"use client";

import clsx from "clsx";

import { Avatar } from "@/app/components/Avatar";
import { FullNotifications } from "@/types/NotificationTypes";
import { EnableModalType } from "./NotificationsList";
import { formatDate } from "@/app/utils/formatDate";
import { User } from "@prisma/client";

interface NotificationBoxProps {
  data: FullNotifications[];
  enableModal: ({ user, notification }: EnableModalType) => Promise<void>;
  currentUser: User;
}

export const NotificationBox: React.FC<NotificationBoxProps> = ({
  data,
  enableModal,
  currentUser,
}) => {
  if (!data.length)
    return (
      <div className="text-center my-12 text-gray-500">
        <h3 className="text-sm">No notifications</h3>
      </div>
    );

  const handleModal = ({
    user,
    notification,
    friend,
    isUserSender,
  }: EnableModalType) => {
    enableModal({ user, notification, friend, isUserSender });
  };

  return (
    <>
      {data.map(({ sender, friend, recipient, ...notification }) => {
        const isUserSender = sender.id === currentUser.id;
        const enableBox =
          currentUser.id !== notification.recipientId &&
          !notification.readBySender;
        return (
          <div
            key={notification.id}
            onClick={() =>
              handleModal({
                user: sender,
                notification,
                friend,
                isUserSender,
              })
            }
            className={clsx({
              ["flex space-x-3 my-4 p-2"]: true,
              ["hover:bg-gray-100 cursor-pointer rounded-md pl-2 duration-300 hover:shadow-sm"]:
                !notification.friendRequestAccepted || enableBox,
            })}
          >
            <Avatar currentUser={isUserSender ? recipient! : sender} />
            <div className="relative w-full">
              <div className="flex text-gray-600 items-center justify-between">
                <h4 className="text-sm truncate lg:w-40">
                  {isUserSender ? recipient?.name : sender.name}
                </h4>
                <span className="text-xs text-gray-400">
                  {formatDate(notification.updatedAt)}
                </span>
              </div>
              <p className="mt-2 truncate text-xs w-44 text-gray-400">
                {notification.message}
              </p>
            </div>
          </div>
        );
      })}
    </>
  );
};
