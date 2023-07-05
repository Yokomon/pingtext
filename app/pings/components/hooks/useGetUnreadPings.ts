import { useMemo } from "react";

import { Pings, User } from "@prisma/client";

export const useGetUnreadPings = (pings: Pings[], currentUser: User) => {
  const unreadPings = useMemo(() => {
    // Improved functionality with O(n) ---> Best case
    return pings.reduce((prev, value) => {
      // If the last ping was already seen, reset count to 0
      if (value.receiverIds.length === 2) {
        prev.set("unreadPings", 0);
      } else if (value.receiverIds.length < 2) {
        // Check if the receiver does not contain the currentUser
        if (value.receiverIds[0] !== currentUser.id) {
          // Increment count for others not seen yet
          prev.set("unreadPings", prev.get("unreadPings")! + 1);
        }
      }
      return prev;
    }, new Map<"unreadPings", number>([["unreadPings", 0]]));
  }, [pings, currentUser]);

  return { unreadPings: unreadPings.get("unreadPings") };
};
