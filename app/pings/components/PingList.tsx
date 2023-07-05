"use client";

import { BiMessageDetail } from "@react-icons/all-files/bi/BiMessageDetail";
import clsx from "clsx";
import { useEffect, useState } from "react";

import { SearchInput } from "@/app/components/inputs/SearchInput";
import { FullConversationType } from "@/types/ConversationTypes";
import { useConversation } from "@/app/hooks/useConversation";
import { PingBox } from "./PingBox";
import { User } from "@prisma/client";
import { usePusher } from "@/app/context/PusherContext";
import { FullPingType } from "@/types/PingsType";
import { notificationSound } from "@/app/utils/notificationSound";

export interface PusherConversation {
  conversationId?: string;
  newPing: FullPingType;
}
interface PingListProps {
  conversations: FullConversationType[];
  currentUser: User;
}

export const PingList: React.FC<PingListProps> = ({
  conversations,
  currentUser,
}) => {
  const [currentConversations, setCurrentConversations] =
    useState(conversations);
  const [isOpen, _conversationId] = useConversation();
  const pusherClient = usePusher();

  useEffect(() => {
    pusherClient.subscribe("conversations");

    const newConversationHandler: (_T: FullConversationType) => void = (
      conversation: FullConversationType
    ) => {
      setCurrentConversations((currentConversations) => {
        if (
          currentConversations.some((convo) => convo.id === conversation.id)
        ) {
          return currentConversations;
        }

        return [...currentConversations, conversation];
      });
    };

    const updateConversation: (_T: PusherConversation) => void = ({
      conversationId,
      newPing,
    }) => {
      const pingSound = notificationSound();
      if (newPing) {
        setCurrentConversations((currentConversation) =>
          currentConversation.map((convo) => {
            if (convo.id === conversationId) {
              return {
                ...convo,
                pings: [...convo.pings!, newPing],
                lastPingAt: newPing.createdAt,
              };
            }
            return convo;
          })
        );
        // Play sound only when the currentUser hasn't viewed the Ping
        if (
          newPing.receiverIds.indexOf(currentUser.id) === -1 &&
          !_conversationId
        ) {
          pingSound.play();
        }
      }
    };

    pusherClient.bind("conversations:new", newConversationHandler);
    pusherClient.bind("conversations:update", updateConversation);

    return () => {
      pusherClient.unsubscribe("conversations");
      pusherClient.unbind("conversations:new", newConversationHandler);
      pusherClient.unbind("conversations:update", updateConversation);
    };
  }, [pusherClient, currentUser, _conversationId]);

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
