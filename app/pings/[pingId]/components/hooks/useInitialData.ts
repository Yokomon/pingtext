import axios from "axios";
import { useEffect, useState } from "react";

import { usePusher } from "@/app/context/PusherContext";
import { formatPingChats } from "@/app/utils/formatDate";
import { FullPingType } from "@/types/PingsType";
import { PusherConversation } from "@/app/pings/components/types";

interface IProps {
  pings: FullPingType[];
  conversationId: string;
}

export const useInitialData = ({ pings, conversationId }: IProps) => {
  const [initialData, setInitialData] = useState(formatPingChats(pings));

  const pusherClient = usePusher();

  useEffect(() => {
    pusherClient.subscribe(conversationId as string);

    const newPingHandler: (_T: PusherConversation) => void = ({ newPing }) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

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

    const updatePingHandler: (_T: FullPingType) => void = (ping) => {
      setInitialData((initialData) => {
        const isPingRead = ping.receiverIds.length === 2;
        const notReadPing = initialData.filter(
          (data) => "id" in data && data.receiverIds.length === 1
        );

        if (isPingRead && notReadPing.length > 1) {
          return initialData.map((data) => {
            if ("id" in data) return { ...data, receiverIds: new Array(2) };
            return data;
          });
        }

        return initialData.map((data) => {
          if ("id" in data && data.id === ping.id) return ping;

          return data;
        });
      });
    };

    pusherClient.bind("pings:new", newPingHandler);
    pusherClient.bind("ping:updated", updatePingHandler);

    return () => {
      pusherClient.unbind("pings:new", newPingHandler);
      pusherClient.unbind("ping:updated", updatePingHandler);
      pusherClient.unsubscribe(conversationId as string);
    };
  }, [conversationId, pusherClient]);

  return { initialData };
};
