import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { TiMessages } from "react-icons/ti";
import { HiUsers } from "react-icons/hi";

export const useRoutes = () => {
  const pathname = usePathname();

  const routes = useMemo(
    () => [
      {
        label: "pings",
        path: "/pings",
        icon: TiMessages,
        active: pathname === "/pings",
      },
      {
        label: "friends",
        path: "/friends",
        icon: HiUsers,
        active: pathname === "/friends",
      },
    ],
    [pathname]
  );

  return routes;
};
