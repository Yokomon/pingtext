import { getConversations } from "../actions/getConversations";
import { getCurrentUser } from "../actions/getCurrentUser";
import SideBar from "../components/sidebar/Sidebar";
import { PingList } from "./components/PingList";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userConversations = await getConversations();
  const currentUser = await getCurrentUser();

  return (
    <SideBar>
      <div className="h-full">
        <PingList
          conversations={userConversations}
          currentUser={currentUser!}
        />
        {children}
      </div>
    </SideBar>
  );
}
