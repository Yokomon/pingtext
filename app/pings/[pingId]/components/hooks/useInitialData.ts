import { useEffect, useRef, useState } from "react";
import { Members } from "pusher-js";
import axios from "axios";

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

  const pingMembers = useRef<Set<string>>();

  const pusherClient = usePusher();

  useEffect(() => {
    const channel = pusherClient.subscribe(`presence-${conversationId}`);

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers = new Set<string>();
      const lastPing = pings[pings.length - 1];

      members.each((member: Record<string, any>) => {
        initialMembers.add(member.id);
      });

      pingMembers.current = initialMembers;

      if (
        lastPing?.sender.email !== members.me.id &&
        lastPing?.receiverIds.length !== 2
      ) {
        axios.post(`/api/conversations/${conversationId}/seen`);
      }
    });

    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      pingMembers.current?.add(member.id);
    });

    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      pingMembers.current?.delete(member.id);
    });

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
        const isPingRead =
          pingMembers.current?.size === 2 || ping.receiverIds.length === 2;

        const notReadPing = initialData.filter(
          (data) => "id" in data && data.receiverIds.length === 1
        );

        if (isPingRead && notReadPing.length > 0) {
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

    channel.bind("pings:new", newPingHandler);
    channel.bind("ping:updated", updatePingHandler);

    return () => {
      if (pingMembers.current?.size) {
        channel.unsubscribe();
        channel.unbind("pings:new", newPingHandler);
        channel.unbind("ping:updated", updatePingHandler);
      }
    };
  }, [conversationId, pings, pusherClient]);

  return { initialData };
};
