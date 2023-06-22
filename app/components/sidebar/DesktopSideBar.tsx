"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { BiPowerOff } from "@react-icons/all-files/bi/BiPowerOff";
import { BsMoon } from "@react-icons/all-files/bs/BsMoon";
import { HiOutlineLightBulb } from "@react-icons/all-files/hi/HiOutlineLightBulb";
import { FiBell } from "@react-icons/all-files/fi/FiBell";
import { Notification, User } from "@prisma/client";

import { useRoutes } from "@/app/hooks/useRoutes";
import { Avatar } from "../Avatar";
import { DesktopItem } from "./DesktopItem";

interface DesktopSideBarProps {
  currentUser: User;
  notifications?: Notification[];
}

export const DesktopSideBar: React.FC<DesktopSideBarProps> = ({
  currentUser,
  notifications,
}) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const routes = useRoutes();
  const pathname = usePathname();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTheme = useCallback(() => {
    if (theme === "light") {
      return setTheme("dark");
    }
    setTheme("light");
  }, [theme, setTheme]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="hidden lg:fixed h-full lg:inset-y-0 lg:left-0 lg:w-20 z-10 bg-gray-50 dark:bg-black dark:border-r dark:border-gray-50/10 lg:flex flex-col shadow-sm p-4">
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
        <ul role={"list"} className="space-y-5">
          <DesktopItem
            label="Notifications"
            path="/notifications"
            icon={FiBell}
            active={pathname === "/notifications"}
            notifications={notifications}
          />
          <li>
            <Avatar currentUser={currentUser} />
          </li>
          <DesktopItem
            label={theme === "light" ? "Light" : "Dark"}
            icon={theme === "light" ? BsMoon : HiOutlineLightBulb}
            onClick={handleTheme}
            isTheme
          />
          <DesktopItem
            label="Sign out"
            icon={BiPowerOff}
            onClick={signOut}
            signOut
          />
        </ul>
      </nav>
    </div>
  );
};
