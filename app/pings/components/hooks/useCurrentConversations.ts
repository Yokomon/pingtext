import { useEffect, useState } from "react";

import { usePusher } from "@/app/context/PusherContext";
import { notificationSound } from "@/app/utils/notificationSound";
import { FullConversationType } from "@/types/ConversationTypes";
import { User } from "@prisma/client";
import { PusherConversation } from "../types";

interface IProps {
  conversations: FullConversationType[];
  conversationId: string;
  currentUser: User;
}

export const useCurrentConversations = ({
  conversations,
  conversationId,
  currentUser,
}: IProps) => {
  const [currentConversations, setCurrentConversations] =
    useState(conversations);

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
      }

      // Notification sound is only heard by other users
      if (
        newPing.sender.id !== currentUser.id &&
        newPing.receiverIds.length === 1
      ) {
        pingSound.play();
      }
    };

    pusherClient.bind("conversations:new", newConversationHandler);
    pusherClient.bind("conversations:update", updateConversation);

    return () => {
      pusherClient.unsubscribe("conversations");
      pusherClient.unbind("conversations:new", newConversationHandler);
      pusherClient.unbind("conversations:update", updateConversation);
    };
  }, [pusherClient, currentUser, conversationId]);

  return { currentConversations };
};
