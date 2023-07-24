"use client";

import { HiOutlineDotsHorizontal } from "@react-icons/all-files/hi/HiOutlineDotsHorizontal";
import { MdArrowBack } from "@react-icons/all-files/md/MdArrowBack";

import { Avatar } from "@/app/components/Avatar";
import { User } from "@prisma/client";
import { useStore } from "@/app/hooks/useStore";
import useChannelList from "@/app/hooks/useChannelList";

interface HeaderProps {
  otherUser: User;
}

export const Header: React.FC<HeaderProps> = ({ otherUser }) => {
  const members = useStore(useChannelList, (state) => state.members);
  const isUserOnline = members.has(otherUser.email);

  return (
    <div className="flex items-center p-4 h-20 justify-between border-b border-gray-100 dark:bg-neutral-900 dark:border-gray-50/10 w-full shadow-md">
      <div className="p-2 hover:bg-sky-100 rounded-full duration-500 lg:hidden">
        <MdArrowBack
          size={24}
          className="hover:text-sky-600 cursor-pointer text-gray-500"
        />
      </div>
      <div className="ml-5 flex flex-1 space-x-3">
        <Avatar currentUser={otherUser} />
        <div>
          <h4 className="text-gray-700 dark:text-gray-200">{otherUser.name}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isUserOnline ? "Available" : "Offline"}
          </p>
        </div>
      </div>
      <div className="p-2 rounded-full hover:bg-sky-100 duration-500 text-gray-500 hover:text-sky-600">
        <HiOutlineDotsHorizontal size={26} className="cursor-pointer" />
      </div>
    </div>
  );
};
