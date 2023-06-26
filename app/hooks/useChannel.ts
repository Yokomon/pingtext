import { Channel, Members } from "pusher-js";
import { useEffect, useState } from "react";

import { pusherClient } from "../lib/pusher";
import useChannelList from "./useChannelList";

export function useChannel() {
  const { set, add, remove } = useChannelList();

  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    const channel = pusherClient.subscribe("presence-messenger");
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
        pusherClient.unsubscribe("presence-messenger");
        pusherClient.disconnect();

        setActiveChannel(null);
      }
    };
  }, [activeChannel, set, add, remove]);
}
