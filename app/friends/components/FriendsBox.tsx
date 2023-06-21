"use client";

import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { TiUserAdd } from "@react-icons/all-files/ti/TiUserAdd";
import { RiUserFollowFill } from "@react-icons/all-files/ri/RiUserFollowFill";
import { RiSendPlaneFill } from "@react-icons/all-files/ri/RiSendPlaneFill";

import { Avatar } from "@/app/components/Avatar";
import { FullUsersTypes } from "@/types/UserTypes";

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
  const router = useRouter();

  const conversationMutation = useMutation({
    mutationFn: (id: string) => {
      return axios.post("/api/conversations", { id });
    },
    onSuccess: async ({ data }) => {
      router.push(`/pings/${data.id}`);
    },
    cacheTime: 500000,
  });

  const handleConversation = () => {
    conversationMutation.mutate(user.id);
  };

  return (
    <div className="w-full flex items-start my-6 space-x-3">
      <Avatar currentUser={user} />
      <div className="relative w-full">
        <div className={"flex items-center justify-between"}>
          <h3 className="text-sm text-gray-600 dark:text-white">{user.name}</h3>
          {discovery ? (
            friendShipAccepted || !enableModal ? (
              <RiUserFollowFill
                size={36}
                className="text-sky-600 absolute right-0 top-1 p-2"
              />
            ) : (
              <TiUserAdd
                size={36}
                onClick={() => enableModal(user)}
                className="text-sky-600 duration-500 absolute right-0 top-1 p-2 cursor-pointer hover:bg-sky-100 rounded-md"
              />
            )
          ) : (
            <div
              className="p-1.5 cursor-pointer duration-500 hover:bg-sky-100 absolute right-2 top-1 rounded-md pr-2.5"
              onClick={handleConversation}
            >
              <RiSendPlaneFill size={20} className="text-sky-600 rotate-45 " />
            </div>
          )}
        </div>
        <span className="text-xs dark:text-gray-400">Available</span>
      </div>
    </div>
  );
};
