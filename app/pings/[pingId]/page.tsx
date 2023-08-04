import { redirect } from "next/navigation";

import { getConversationById } from "@/app/actions/getConversationById";
import { getPings } from "@/app/actions/getPings";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Body } from "./components/Body";

interface IParams {
  params: {
    pingId: string;
  };
}

export default async function PingHomePage({ params }: IParams) {
  const [conversation, pings] = await Promise.all([
    getConversationById(params.pingId),
    getPings(params.pingId),
  ]);

  // Redirect users if there is no conversation
  if (!conversation) redirect("/pings");

  const otherUser = conversation?.users[0];

  return (
    <div className="lg:pl-[22rem] h-full">
      <div className="flex h-full flex-col">
        <Header otherUser={otherUser} conversationId={conversation.id} />
        <Body pings={pings} />
        <Footer conversation={conversation} />
      </div>
    </div>
  );
}
