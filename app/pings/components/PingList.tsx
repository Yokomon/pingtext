"use client";

import { BiMessageDetail } from "@react-icons/all-files/bi/BiMessageDetail";
import clsx from "clsx";

import { SearchInput } from "@/app/components/inputs/SearchInput";
import { FullConversationType } from "@/types/ConversationTypes";
import { useConversation } from "@/app/hooks/useConversation";
import { PingBox } from "./PingBox";
import { User } from "@prisma/client";
import { useCurrentConversations } from "./hooks/useCurrentConversations";

interface PingListProps {
  conversations: FullConversationType[];
  currentUser: User;
}

export const PingList: React.FC<PingListProps> = ({
  conversations,
  currentUser,
}) => {
  const [isOpen, _conversationId] = useConversation();

  const { currentConversations } = useCurrentConversations({
    conversations,
    currentUser,
    conversationId: _conversationId as string,
  });

  return (
    <aside
      className={clsx({
        ["fixed lg:block dark:bg-slate-900 left-0 lg:left-12 pl-12 inset-0 lg:w-[24rem] border-r border-gray-50 dark:border-gray-50/10 shadow-sm p-4"]:
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
          {currentConversations.map(({ users, id, pings, lastPingAt }) => (
            <PingBox
              otherUser={users[0]}
              key={id}
              pings={pings!}
              lastPingAt={lastPingAt!}
              currentUser={currentUser}
              conversationId={id}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};
