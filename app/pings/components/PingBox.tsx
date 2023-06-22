"use client";

import { Avatar } from "@/app/components/Avatar";
import { User } from "@prisma/client";

interface PingBoxProps {
  user: User;
}

export const PingBox: React.FC<PingBoxProps> = ({ user }) => {
  return (
    <div className="flex my-3 w-full cursor-pointer hover:bg-gray-100 hover:text-black text-gray-700 dark:text-white dark:hover:text-gray-800 p-3 duration-300 rounded-md space-x-2 items-center">
      <Avatar currentUser={user} />
      <div className="min-w-0 w-full">
        <div className="flex items-start justify-between w-full mb-2">
          <h3 className="text-sm">{user.name}</h3>
          <p className="text-xs mt-0.5">11:35pm</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="truncate w-40 text-sm text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse labore
            dolores, ipsam ullam quos consequuntur sapiente, beatae modi quod
            assumenda veniam odio? Unde excepturi culpa vitae temporibus
            architecto quidem inventore.
          </p>
          <span className="text-xs text-white bg-red-600 w-fit p-2 h-5 justify-center flex items-center rounded-full">
            2
          </span>
        </div>
      </div>
    </div>
  );
};
