import { redirect } from "next/navigation";

import { getConversationById } from "@/app/actions/getConversationById";
import { getPings } from "@/app/actions/getPings";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Body } from "./components/Body";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

interface IParams {
  params: {
    pingId: string;
  };
}

export default async function PingHomePage({ params }: IParams) {
  const conversation = await getConversationById(params.pingId);
  const pings = await getPings(params.pingId);
  const currentUser = await getCurrentUser();

  // Redirect users if there is no conversation
  if (!conversation) redirect("/pings");

  const otherUser = conversation?.users[0];

  return (
    <div className="lg:pl-[22rem] h-full">
      <div className="flex h-full flex-col">
        <Header otherUser={otherUser} />
        <Body pings={pings} currentUser={currentUser} />
        <Footer conversation={conversation} />
      </div>
    </div>
  );
}
