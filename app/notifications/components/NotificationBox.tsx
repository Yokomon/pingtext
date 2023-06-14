"use client";

import clsx from "clsx";
import { format } from "date-fns";

import { Avatar } from "@/app/components/Avatar";
import { FullNotifications } from "@/types/NotificationTypes";
import { EnableModalType } from "./NotificationsList";

interface NotificationBoxProps {
  data: FullNotifications[];
  enableModal: ({ user, notification }: EnableModalType) => Promise<void>;
  unRead?: boolean;
}

export const NotificationBox: React.FC<NotificationBoxProps> = ({
  data,
  enableModal,
  unRead,
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
  }: EnableModalType) => {
    enableModal({ user, notification });
  };

  return (
    <>
      {data.map(({ sender, ...notification }) => (
        <div
          key={notification.id}
          onClick={() =>
            handleModal({
              user: sender,
              notification,
            })
          }
          className={clsx({
            ["flex space-x-3 my-2 p-4"]: true,
            ["hover:bg-gray-100 cursor-pointer rounded-md pl-2 duration-300 hover:shadow-sm"]:
              !notification.message.includes("accepted"),
          })}
        >
          <Avatar currentUser={sender} />
          <div className="relative w-full">
            <div className="flex text-gray-600 items-center justify-between">
              <h4 className="text-sm">{sender.name}</h4>
              <span className="text-xs text-gray-400">
                {format(
                  new Date(
                    unRead ? notification.createdAt : notification.updatedAt
                  ),
                  "p"
                )}
              </span>
            </div>
            <p className="mt-2 truncate text-xs w-44 text-gray-400">
              {notification.message}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
