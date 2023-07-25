import { Channel, Members } from "pusher-js";
import { useEffect, useState } from "react";

import { usePusher } from "../context/PusherContext";
import useChannelList from "./useChannelList";

export function useChannel() {
  const { set, add, remove } = useChannelList();
  const pusherClient = usePusher();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    const channel = pusherClient.subscribe("presence-pingtext");
    setActiveChannel(channel);

    channel.bind("pusher:subscription_succeeded", (members: Members) => {
      const initialMembers = new Set<string>();

      members.each((member: Record<string, any>) => {
        initialMembers.add(member.id);
      });

      set(initialMembers);
    });

    channel.bind("pusher:member_added", (member: Record<string, any>) => {
      add(member.id);
    });

    channel.bind("pusher:member_removed", (member: Record<string, any>) => {
      remove(member.id);
    });

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-pingtext");
        setActiveChannel(null);
      }
    };
  }, [activeChannel, set, add, remove, pusherClient]);
}
