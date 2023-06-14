import { getAllNotifications } from "@/app/actions/getAllNotifications";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { DesktopSideBar } from "./DesktopSideBar";

interface SideBarProps {
  children: React.ReactNode;
}

export default async function SideBar({ children }: SideBarProps) {
  const currentUser = await getCurrentUser();
  const notifications = await getAllNotifications("unread");
  return (
    <div className="h-full">
      <DesktopSideBar
        currentUser={currentUser!}
        notifications={notifications}
      />
      {children}
    </div>
  );
}
