"use client";

import { useConversation } from "@/app/hooks/useConversation";
import { FullPingType } from "@/types/PingsType";
import { DateStamp } from "./DateStamp";
import { PingContainer } from "./PingContainer";
import { useInitialData } from "./hooks/useInitialData";
import { ScrollListener } from "@/app/components/ScrollListener";

interface BodyProps {
  pings: FullPingType[];
}

export const Body: React.FC<BodyProps> = ({ pings }) => {
  const [_, conversationId] = useConversation();

  const { initialData } = useInitialData({
    pings,
    conversationId: conversationId as string,
  });

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
      <ScrollListener initialData={initialData} />
    </div>
  );
};
