"use client";

import { formatPingChat } from "@/app/utils/formatDate";
import { FullPingType } from "@/types/PingsType";
import { DateStamp } from "./DateStamp";
import { PingContainer } from "./PingContainer";

interface BodyProps {
  pings: FullPingType[];
}

export const Body: React.FC<BodyProps> = ({ pings }) => {
  const dateStamp = formatPingChat(pings);

  return (
    <div className="flex-1 h-full w-full overflow-y-auto bg-gray-50 dark:bg-black">
      {pings.map((ping, idx) => (
        <>
          {idx === 0 && dateStamp ? <DateStamp data={dateStamp} /> : null}
          <PingContainer data={ping} key={ping.id} />
        </>
      ))}
    </div>
  );
};
