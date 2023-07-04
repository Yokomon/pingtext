"use client";

import PusherClient from "pusher-js";
import React, { createContext, useEffect, useContext, useMemo } from "react";

const PusherContext = createContext<PusherClient | null>(null);

export const PusherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pusherClient = useMemo(() => {
    return new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      channelAuthorization: {
        endpoint: "/api/pusher/auth",
        transport: "ajax",
      },
      cluster: "mt1",
    });
  }, []);

  useEffect(() => {
    pusherClient.connect();

    return () => {
      pusherClient.disconnect();
    };
  }, [pusherClient]);

  return (
    <PusherContext.Provider value={pusherClient}>
      {children}
    </PusherContext.Provider>
  );
};

export const usePusher = () => useContext(PusherContext)!;
