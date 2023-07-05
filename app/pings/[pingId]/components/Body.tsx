"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { useConversation } from "@/app/hooks/useConversation";
import { formatPingChats } from "@/app/utils/formatDate";
import { FullPingType } from "@/types/PingsType";
import { DateStamp } from "./DateStamp";
import { PingContainer } from "./PingContainer";
import { usePusher } from "@/app/context/PusherContext";
import { PusherConversation } from "../../components/PingList";

interface BodyProps {
  pings: FullPingType[];
}

export const Body: React.FC<BodyProps> = ({ pings }) => {
  const [initialData, setInitialData] = useState(formatPingChats(pings));

  const pusherClient = usePusher();

  const bodyRef = useRef<HTMLDivElement>(null);

  const [_, conversationId] = useConversation();

  useEffect(() => {
    if (!!initialData.length) {
      axios.post(`/api/conversations/${conversationId}/seen`);
    }
    setTimeout(() => {
      if (bodyRef.current && !!initialData.length) {
        bodyRef.current.scrollIntoView(true);
      }
    }, 100);
  }, [initialData, conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId as string);

    const pingHandler: (_T: PusherConversation) => void = ({ newPing }) => {
      setInitialData((data) => {
        const hasTodayType = data.some(
          (item) => "type" in item && item.date === "Today"
        );
        const newData = hasTodayType
          ? [...data, newPing]
          : [...data, ...formatPingChats([newPing])];
        return newData;
      });
    };

    pusherClient.bind("pings:new", pingHandler);

    return () => {
      pusherClient.unbind("pings:new", pingHandler);
      pusherClient.unsubscribe(conversationId as string);
    };
  }, [conversationId, pusherClient]);

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
              return (
                <PingContainer
                  data={ping}
                  key={ping.id}
                  lastPing={initialData[initialData.length - 1] as FullPingType}
                />
              );
            }
          )
        : null}
      <div ref={bodyRef} className="pt-12" />
    </div>
  );
};
