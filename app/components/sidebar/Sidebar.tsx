import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { DesktopSideBar } from "./DesktopSideBar";

interface SideBarProps {
  children: React.ReactNode;
}

export default async function SideBar({ children }: SideBarProps) {
  const currentUser = await getCurrentUser();
  return (
    <div className="h-full">
      <DesktopSideBar currentUser={currentUser!} />
      {children}
    </div>
  );
}
