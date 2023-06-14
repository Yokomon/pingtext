"use client";

import { FiBell } from "@react-icons/all-files/fi/FiBell";

import { useRoutes } from "@/app/hooks/useRoutes";
import { Notification, User } from "@prisma/client";
import { Avatar } from "../Avatar";
import { DesktopItem } from "./DesktopItem";

interface DesktopSideBarProps {
  currentUser?: User;
  notifications?: Notification[];
}

export const DesktopSideBar: React.FC<DesktopSideBarProps> = ({
  currentUser,
  notifications,
}) => {
  const routes = useRoutes();

  return (
    <div className="hidden lg:fixed h-full lg:inset-y-0 lg:left-0 lg:w-20 z-20 bg-gray-50 lg:flex flex-col shadow-sm p-4">
      <nav className="flex flex-col items-center justify-between">
        <ul role={"list"} className="mt-4 space-y-4 flex flex-col items-center">
          {routes.map(({ label, path, icon, active }) => (
            <DesktopItem
              label={label}
              path={path}
              icon={icon}
              active={active}
              key={label}
            />
          ))}
        </ul>
      </nav>
      <nav className="flex flex-col space-y-5 items-center justify-center mt-auto">
        <ul role={"list"}>
          <DesktopItem
            label="Notifications"
            path="/notifications"
            icon={FiBell}
            notifications={notifications}
          />
        </ul>
        <Avatar currentUser={currentUser} />
      </nav>
    </div>
  );
};
