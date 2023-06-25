"use client";

import clsx from "clsx";

import { Avatar } from "@/app/components/Avatar";
import { decryptMessage } from "@/app/utils/encryption";
import { formatDate } from "@/app/utils/formatDate";
import { Pings, User } from "@prisma/client";
import { useRouter } from "next/navigation";

interface PingBoxProps {
  otherUser: User;
  pings: Pings[];
  lastPingAt: Date;
  currentUser: User;
  conversationId: string;
}

export const PingBox: React.FC<PingBoxProps> = ({
  otherUser,
  pings,
  lastPingAt,
  currentUser,
  conversationId,
}) => {
  const router = useRouter();

  const lastMessage = pings[pings.length - 1];

  const unreadMessages = pings.reduce((prev, value) => {
    if (value.receiverIds.indexOf(currentUser.id) === -1) {
      prev = prev + 1;
    }
    return prev;
  }, 0);

  const handleRedirect = () => {
    return router.push(`/pings/${conversationId}`);
  };

  return (
    <div
      onClick={handleRedirect}
      className={
        "flex my-3 w-full cursor-pointer hover:bg-gray-100 hover:text-black text-gray-700 dark:text-white dark:hover:text-gray-800 p-3 duration-300 rounded-md space-x-2 items-center"
      }
    >
      <Avatar currentUser={otherUser} />
      <div className="min-w-0 w-full">
        <div className="flex items-start justify-between w-full mb-2">
          <h3 className="text-sm">{otherUser.name}</h3>
          <p className="text-xs mt-0.5">
            {lastPingAt ? formatDate(lastPingAt) : null}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p
            className={clsx({
              ["truncate w-40 text-sm text-gray-400"]: true,
              ["text-gray-700 dark:text-inherit"]: unreadMessages,
            })}
          >
            {decryptMessage(lastMessage.body)}
          </p>
          {unreadMessages ? (
            <span className="text-xs text-white bg-red-600 w-fit p-2 h-5 justify-center flex items-center rounded-full">
              {unreadMessages}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
