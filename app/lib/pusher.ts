import Pusher from "pusher";

const PusherServer = require("pusher");

export const pusherServer: Pusher = new PusherServer({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.NEXT_PUBLIC_PUSHER_SECRET!,
  cluster: "mt1",
  useTLS: true,
});
