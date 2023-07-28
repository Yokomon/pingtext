"use client";

import { Avatar } from "@/app/components/Avatar";
import { User } from "@prisma/client";
import { BsFillCameraVideoFill } from "@react-icons/all-files/bs/BsFillCameraVideoFill";

interface ICallListBox {
  users: User;
  handleCall: (_id: string) => void;
}

export const CallListBox: React.FC<ICallListBox> = ({ users, handleCall }) => {
  return (
    <div className="flex justify-between items-center my-5 space-x-4">
      <Avatar currentUser={users} />
      <div className="h-full relative flex flex-col flex-1 mx-3 space-y-1 text-gray-700 dark:text-gray-300">
        <h4 className="text-sm">{users.name}</h4>
        <p className="text-xs text-gray-400 truncate w-40">{users.email}</p>
      </div>
      <BsFillCameraVideoFill
        onClick={() => handleCall(users.id)}
        size={18}
        className="text-sky-600 dark:text-sky-500 cursor-pointer"
      />
    </div>
  );
};
