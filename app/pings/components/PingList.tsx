"use client";

import { BiMessageDetail } from "@react-icons/all-files/bi/BiMessageDetail";
import clsx from "clsx";

import { SearchInput } from "@/app/components/inputs/SearchInput";
import { FullConversationType } from "@/types/ConversationTypes";
import { useConversation } from "@/app/hooks/useConversation";
import { PingBox } from "./PingBox";

interface PingListProps {
  conversations: FullConversationType[];
}

export const PingList: React.FC<PingListProps> = ({ conversations }) => {
  const [isOpen] = useConversation();

  return (
    <aside
      className={clsx({
        ["fixed lg:block dark:bg-neutral-900 left-0 lg:left-12 pl-12 inset-0 lg:w-[24rem] border-r border-gray-50 dark:border-gray-50/10 shadow-sm p-4"]:
          true,
        ["hidden"]: isOpen as boolean,
      })}
    >
      <div className="px-3">
        <h1 className="text-3xl mb-5 text-sky-600 font-semibold tracking-wide">
          Pings
        </h1>
        <SearchInput fullWidth id="searchPings" />
        <div>
          <div className="text-gray-500 dark:text-gray-200 flex items-center space-x-2 mt-8">
            <BiMessageDetail size={17} />
            <h4 className="text-sm">All Pings</h4>
          </div>
          {conversations.map(({ users, id }) => (
            <PingBox user={users[0]} key={id} />
          ))}
        </div>
      </div>
    </aside>
  );
};
