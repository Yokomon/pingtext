import { AuthForm } from "./components/AuthForm";
import { TiMessage } from "react-icons/ti";

export default function Home() {
  return (
    <main className="min-h-screen w-full p-6 sm:p-10 md:p-32 lg:p-14 flex flex-col lg:flex-row items-center space-y-4 sm:space-x-4 sm:justify-between">
      <div>
        <div className="flex items-center space-x-4">
          <h1 className="bg-clip-text text-transparent h-20 bg-gradient-to-r from-sky-400 to-sky-600 text-6xl sm:text-7xl">
            Ping text
          </h1>
          <TiMessage size={38} className="text-sky-600" />
        </div>
        <p className="text-lg sm:text-xl py-6 sm:py-4">
          Chat, Connect, Discover: Your Gateway to Conversation!
        </p>
      </div>
      <AuthForm />
    </main>
  );
}
