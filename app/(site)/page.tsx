import { TiMessage } from "@react-icons/all-files/ti/TiMessage";
import { redirect } from "next/navigation";

import { AuthForm } from "./components/AuthForm";
import getSession from "../actions/getSession";

export default async function Home() {
  const session = await getSession();

  if (session?.user) {
    redirect("/pings");
  }

  return (
    <main className="min-h-screen max-w-[117rem] mx-auto p-6 sm:p-10 md:p-28 lg:p-14 flex flex-col lg:flex-row items-start lg:items-center space-y-4 sm:space-x-4 lg:justify-between">
      <div className="sm:mx-4 lg:mx-0 w-full lg:w-1/2">
        <div className="flex items-center space-x-4">
          <h1 className="bg-clip-text text-transparent h-14 sm:h-20 bg-gradient-to-r from-sky-400 to-sky-600 text-5xl sm:text-7xl">
            Ping text
          </h1>
          <TiMessage size={38} className="text-sky-600" />
        </div>
        <p className="text-lg sm:text-xl py-2 sm:py-4">
          Chat, Connect, Discover: Your Gateway to Conversation!
        </p>
        <p className="py-5 sm:py-2 text-base text-gray-600">
          Share your passions, exchange knowledge, and celebrate the joy of
          human connection. Join pingtext today and experience the thrill of
          engaging conversations that will leave you inspired, enlightened, and
          connected like never before!
        </p>
      </div>
      <AuthForm />
    </main>
  );
}
