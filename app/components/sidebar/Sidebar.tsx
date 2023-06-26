import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getCurrentUserNotifications } from "@/app/actions/getCurrentUserNotifications";
import { ChannelStatus } from "../ChannelStatus";
import { DesktopSideBar } from "./DesktopSideBar";

interface SideBarProps {
  children: React.ReactNode;
}

export default async function SideBar({ children }: SideBarProps) {
  const currentUser = await getCurrentUser();
  const notifications = await getCurrentUserNotifications();
  return (
    <div className="h-full">
      <ChannelStatus />
      <DesktopSideBar
        currentUser={currentUser!}
        notifications={notifications}
      />
      <main className="lg:pl-20 h-full">{children}</main>
    </div>
  );
}
