"use client";

import PusherClient from "pusher-js";
import React, { createContext, useContext } from "react";

const PusherContext = createContext<{ pusher: PusherClient } | null>(null);

const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  channelAuthorization: {
    endpoint: "/api/pusher/auth",
    transport: "ajax",
  },
  cluster: "mt1",
  forceTLS: true,
});

export const PusherProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <PusherContext.Provider value={{ pusher }}>
      {children}
    </PusherContext.Provider>
  );
};

export const usePusher = () => {
  const context = useContext(PusherContext);

  if (!context) {
    throw new Error("Pusher must be used within a PusherProvider");
  }

  const { pusher } = context;

  return pusher;
};
