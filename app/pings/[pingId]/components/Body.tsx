"use client";

import axios from "axios";
import { useEffect, useRef } from "react";

import { useConversation } from "@/app/hooks/useConversation";
import { FullPingType } from "@/types/PingsType";
import { DateStamp } from "./DateStamp";
import { PingContainer } from "./PingContainer";
import { User } from "@prisma/client";
import { useInitialData } from "./hooks/useInitialData";

interface BodyProps {
  pings: FullPingType[];
  currentUser: User | null;
}

export const Body: React.FC<BodyProps> = ({ pings, currentUser }) => {
  const bodyRef = useRef<HTMLDivElement>(null);

  const [_, conversationId] = useConversation();

  const { initialData } = useInitialData({
    pings,
    conversationId: conversationId as string,
  });

  useEffect(() => {
    if (!currentUser) return;

    const lastPing = pings[pings.length - 1];
    if (
      lastPing.sender.id !== currentUser.id &&
      lastPing.receiverIds.length !== 2
    ) {
      axios.post(`/api/conversations/${conversationId}/seen`);
    }
  }, [conversationId, pings, currentUser]);

  useEffect(() => {
    setTimeout(() => {
      if (bodyRef.current && !!initialData.length) {
        bodyRef.current.scrollIntoView(true);
      }
    }, 100);
  }, [initialData]);

  return (
    <div className="flex-1 h-full w-full overflow-y-auto bg-gray-50 dark:bg-black">
      <div className="items-center justify-center flex">
        <p className="text-= text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-transparent duration-500 w-fit rounded-md text-xs p-2.5 bg-gray-200 dark:bg-sky-500 my-3 ring-1 ring-gray-400 dark:ring-sky-600 shadow-sm">
          Pings are encrypted and secure
        </p>
      </div>

      {!!initialData.length
        ? initialData.map(
            (ping: FullPingType | { type: string; date: string }) => {
              if ("type" in ping) {
                return <DateStamp data={ping.date} key={ping.date} />;
              }
              return <PingContainer data={ping} key={ping.id} />;
            }
          )
        : null}
      <div ref={bodyRef} className="pt-12" />
    </div>
  );
};
