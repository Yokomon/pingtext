"use client";

import { User } from "@prisma/client";
import { TiUserAdd } from "@react-icons/all-files/ti/TiUserAdd";
import { RiUserFollowFill } from "@react-icons/all-files/ri/RiUserFollowFill";

import { Avatar } from "@/app/components/Avatar";
import { FullUsersTypes } from "@/types/UserTypes";
import clsx from "clsx";

interface FriendsBoxProps {
  user: FullUsersTypes | User;
  discovery?: boolean;
  enableModal?: (user: User) => void;
  friendShipAccepted?: boolean;
}

export const FriendsBox: React.FC<FriendsBoxProps> = ({
  user,
  discovery = false,
  enableModal,
  friendShipAccepted,
}) => {
  return (
    <div className="w-full flex items-start my-6 space-x-3">
      <Avatar currentUser={user} />
      <div className="relative w-full">
        <div
          className={clsx({
            "flex items-center": true,
            "justify-between": discovery,
          })}
        >
          <h3 className="text-sm text-gray-600 dark:text-white">{user.name}</h3>
          {discovery ? (
            friendShipAccepted ? (
              <RiUserFollowFill
                size={36}
                className="text-sky-600 absolute right-0 top-1 p-2"
              />
            ) : (
              <TiUserAdd
                size={36}
                onClick={() => enableModal!(user)}
                className="text-sky-600 duration-500 absolute right-0 top-1 p-2 cursor-pointer hover:bg-sky-100 rounded-md"
              />
            )
          ) : null}
        </div>
        <span className="text-xs dark:text-gray-400">Available</span>
      </div>
    </div>
  );
};
